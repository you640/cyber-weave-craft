import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Live shell: NO command allowlist (power-user mode), but still:
//  - admin-only,
//  - rejects shell metacharacters enabling chaining / substitution / redirection,
//  - hard timeout,
//  - full audit log (command + exit + stdout snippet).
// Server-side proxy: secrets never reach the browser.

// Block: backtick, newline/CR, ; & | $ > <  and $( … ) command substitution.
const HARD_FORBIDDEN = /[;&|`$><\n\r]|\$\(/;
const MAX_LEN = 2000;

type ValidationResult = { ok: true } | { ok: false; reason: string };

function validateLive(cmd: string): ValidationResult {
  if (!cmd || typeof cmd !== "string") return { ok: false, reason: "empty command" };
  const trimmed = cmd.trim();
  if (trimmed.length === 0) return { ok: false, reason: "empty command" };
  if (trimmed.length > MAX_LEN) return { ok: false, reason: "command too long" };
  if (HARD_FORBIDDEN.test(trimmed))
    return { ok: false, reason: "forbidden shell metacharacter (; & | $ > < ` newline)" };
  return { ok: true };
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
      command: `[LIVE] ${command}`,
      exit_code: exitCode,
      stdout_snippet: stdout ? stdout.slice(0, 500) : null,
    });
  } catch (e) {
    console.error("[vps-exec-live] audit log insert failed", e);
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

    const validation = validateLive(command);
    if (!validation.ok) {
      await logCommand(supabase, user.id, command || "<empty>", -1, `BLOCKED: ${validation.reason}`);
      return new Response(
        JSON.stringify({ error: "BLOCKED", reason: validation.reason }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const bridgeUrl = Deno.env.get("MCP_UPSTREAM_URL") ?? Deno.env.get("VPS_BRIDGE_URL");
    const bridgeSecret = Deno.env.get("MCP_UPSTREAM_TOKEN") ?? Deno.env.get("VPS_SHARED_SECRET");
    const basicUser = Deno.env.get("OPS_EXEC_BASIC_USER") ?? Deno.env.get("VPS_BASIC_USER");
    const basicPass = Deno.env.get("OPS_EXEC_BASIC_PASS") ?? Deno.env.get("VPS_BASIC_PASS");
    if (!bridgeUrl || !bridgeSecret) {
      return new Response(
        JSON.stringify({ error: "BRIDGE_NOT_CONFIGURED" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const startedAt = Date.now();

    const bridgeHeaders: Record<string, string> = { "Content-Type": "application/json" };
    if (basicUser && basicPass) {
      bridgeHeaders["Authorization"] = `Basic ${btoa(`${basicUser}:${basicPass}`)}`;
      bridgeHeaders["X-Bridge-Auth"] = `Bearer ${bridgeSecret}`;
    } else {
      bridgeHeaders["Authorization"] = `Bearer ${bridgeSecret}`;
    }

    // Diagnostic mode: ?diagnose=1 returns raw bridge response details
    const url = new URL(req.url);
    const diagnose = url.searchParams.get("diagnose") === "1";

    console.log("[vps-exec-live] →", {
      bridgeUrl,
      authMode: basicUser && basicPass ? "basic+bearer" : "bearer",
      command: command.trim(),
      diagnose,
    });

    let bridgeRes: Response;
    try {
      bridgeRes = await fetch(bridgeUrl, {
        method: "POST",
        headers: bridgeHeaders,
        body: JSON.stringify({ command: command.trim() }),
        signal: controller.signal,
      });
    } catch (e) {
      clearTimeout(timeout);
      const msg = e instanceof Error ? e.message : "bridge fetch failed";
      console.error("[vps-exec-live] fetch threw:", msg);
      await logCommand(supabase, user.id, command, -1, `BRIDGE_ERROR: ${msg}`);
      return new Response(
        JSON.stringify({ error: "UPSTREAM_UNREACHABLE", message: msg, bridgeUrl }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    clearTimeout(timeout);

    const durationMs = Date.now() - startedAt;
    const rawBody = await bridgeRes.text();
    const respHeaders: Record<string, string> = {};
    bridgeRes.headers.forEach((v, k) => { respHeaders[k] = v; });

    console.log("[vps-exec-live] ← bridge response:", {
      status: bridgeRes.status,
      statusText: bridgeRes.statusText,
      headers: respHeaders,
      bodyLength: rawBody.length,
      bodyPreview: rawBody.slice(0, 1000),
      durationMs,
    });

    let payload: { exit_code?: number; stdout?: string; stderr?: string; duration_ms?: number } = {};
    let parseError: string | null = null;
    try {
      payload = rawBody ? JSON.parse(rawBody) : {};
    } catch (e) {
      parseError = e instanceof Error ? e.message : "parse failed";
      payload = { stderr: rawBody };
    }

    const exitCode = typeof payload.exit_code === "number" ? payload.exit_code : (bridgeRes.ok ? 0 : -1);
    const stdout = payload.stdout ?? "";
    const stderr = payload.stderr ?? "";

    await logCommand(supabase, user.id, command, exitCode, stdout || stderr || `[empty raw=${rawBody.length}b]`);

    if (diagnose) {
      return new Response(
        JSON.stringify({
          diagnostic: true,
          bridge: {
            url: bridgeUrl,
            status: bridgeRes.status,
            statusText: bridgeRes.statusText,
            headers: respHeaders,
            raw_body: rawBody,
            raw_body_length: rawBody.length,
            parse_error: parseError,
            parsed: payload,
          },
          auth_mode: basicUser && basicPass ? "basic+bearer" : "bearer",
          duration_ms: durationMs,
        }, null, 2),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

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
    console.error("[vps-exec-live] unexpected", e);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
