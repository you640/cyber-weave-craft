import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Server-side allowlist of base commands
const SINGLE_TOKEN_ALLOW = new Set([
  "uptime", "whoami", "hostname", "date", "df", "free", "uname",
  "ls", "cat", "tail", "head", "grep", "wc",
  "who", "w", "id",
]);

// Two-token allow: first token + required second token
const TWO_TOKEN_ALLOW: Record<string, Set<string>> = {
  systemctl: new Set(["status", "is-active"]),
  journalctl: new Set(["--no-pager"]), // followed by -n etc.
  ps: new Set(["aux"]),
  top: new Set(["-bn1"]),
  ss: new Set(["-tulpn"]),
  netstat: new Set(["-tulpn"]),
  docker: new Set(["ps", "logs", "stats"]),
  ufw: new Set(["status"]),
};

const FORBIDDEN_CHARS = /[;&|`$><\n\r]|\$\(/;

type ValidationResult = { ok: true } | { ok: false; reason: string };

function validateCommand(cmd: string): ValidationResult {
  if (!cmd || typeof cmd !== "string") return { ok: false, reason: "empty command" };
  const trimmed = cmd.trim();
  if (trimmed.length === 0) return { ok: false, reason: "empty command" };
  if (trimmed.length > 500) return { ok: false, reason: "command too long" };
  if (FORBIDDEN_CHARS.test(trimmed)) return { ok: false, reason: "forbidden shell metacharacter" };

  const tokens = trimmed.split(/\s+/);
  const first = tokens[0];
  const second = tokens[1];

  if (SINGLE_TOKEN_ALLOW.has(first)) return { ok: true };
  if (TWO_TOKEN_ALLOW[first] && second && TWO_TOKEN_ALLOW[first].has(second)) return { ok: true };

  return { ok: false, reason: `command "${first}${second ? " " + second : ""}" not in allowlist` };
}

async function logCommand(
  supabase: ReturnType<typeof createClient>,
  adminId: string,
  command: string,
  exitCode: number,
  stdout: string,
) {
  try {
    await supabase.from("admin_command_log").insert({
      admin_id: adminId,
      command,
      exit_code: exitCode,
      stdout_snippet: stdout ? stdout.slice(0, 500) : null,
    });
  } catch (e) {
    console.error("[vps-exec] audit log insert failed", e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userData.user;

    const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (roleErr || !isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body: { command?: unknown };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const command = typeof body.command === "string" ? body.command : "";

    const validation = validateCommand(command);
    if (!validation.ok) {
      await logCommand(supabase, user.id, command || "<empty>", -1, `BLOCKED: ${validation.reason}`);
      return new Response(
        JSON.stringify({ error: "BLOCKED", reason: validation.reason }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const bridgeUrl = Deno.env.get("VPS_BRIDGE_URL");
    const bridgeSecret = Deno.env.get("VPS_SHARED_SECRET");
    if (!bridgeUrl || !bridgeSecret) {
      return new Response(
        JSON.stringify({ error: "BRIDGE_NOT_CONFIGURED" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const startedAt = Date.now();

    let bridgeRes: Response;
    try {
      bridgeRes = await fetch(bridgeUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${bridgeSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: command.trim() }),
        signal: controller.signal,
      });
    } catch (e) {
      clearTimeout(timeout);
      const msg = e instanceof Error ? e.message : "bridge fetch failed";
      await logCommand(supabase, user.id, command, -1, `BRIDGE_ERROR: ${msg}`);
      return new Response(
        JSON.stringify({ error: "BRIDGE_ERROR", message: msg }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    clearTimeout(timeout);

    const durationMs = Date.now() - startedAt;
    let payload: { exit_code?: number; stdout?: string; stderr?: string; duration_ms?: number } = {};
    try {
      payload = await bridgeRes.json();
    } catch {
      payload = { stderr: await bridgeRes.text() };
    }

    const exitCode = typeof payload.exit_code === "number" ? payload.exit_code : (bridgeRes.ok ? 0 : -1);
    const stdout = payload.stdout ?? "";
    const stderr = payload.stderr ?? "";

    await logCommand(supabase, user.id, command, exitCode, stdout);

    return new Response(
      JSON.stringify({
        exit_code: exitCode,
        stdout,
        stderr,
        duration_ms: payload.duration_ms ?? durationMs,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("[vps-exec] unexpected", e);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
