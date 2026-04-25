// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { handlePreflight, json, withCors } from "../_shared/cors.ts";

// Server-side allowlist of base commands
const SINGLE_TOKEN_ALLOW = new Set([
  "uptime", "whoami", "hostname", "date", "df", "free", "uname",
  "ls", "cat", "tail", "head", "grep", "wc",
  "who", "w", "id",
  "nexify-health",
  "nexify-wp-audit-start",
  "nexify-wp-audit-status",
  "nexify-list-reports",
  "nexify-latest-report",
]);

const TWO_TOKEN_ALLOW: Record<string, Set<string>> = {
  systemctl: new Set(["status", "is-active"]),
  journalctl: new Set(["--no-pager"]),
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
  supabase: any,
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

// Single bridge attempt with timeout. Throws on network error.
async function bridgeFetchOnce(
  url: string,
  headers: Record<string, string>,
  body: string,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { method: "POST", headers, body, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve((req) => withCors(req, async () => {
  const pre = handlePreflight(req);
  if (pre) return pre;

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json(req, { error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) {
    return json(req, { error: "Unauthorized" }, 401);
  }
  const user = userData.user;

  const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });
  if (roleErr || !isAdmin) {
    return json(req, { error: "Forbidden" }, 403);
  }

  let body: { command?: unknown };
  try {
    body = await req.json();
  } catch {
    return json(req, { error: "Invalid JSON" }, 400);
  }
  const command = typeof body.command === "string" ? body.command : "";

  const validation = validateCommand(command);
  if (!validation.ok) {
    await logCommand(supabase, user.id, command || "<empty>", -1, `BLOCKED: ${validation.reason}`);
    return json(req, { error: "BLOCKED", reason: validation.reason }, 400);
  }

  const bridgeUrl = Deno.env.get("VPS_BRIDGE_URL");
  const bridgeSecret = Deno.env.get("VPS_SHARED_SECRET");
  const basicUser = Deno.env.get("VPS_BASIC_USER");
  const basicPass = Deno.env.get("VPS_BASIC_PASS");
  if (!bridgeUrl || !bridgeSecret) {
    return json(req, { error: "BRIDGE_NOT_CONFIGURED" }, 503);
  }

  const bridgeHeaders: Record<string, string> = { "Content-Type": "application/json" };
  if (basicUser && basicPass) {
    bridgeHeaders["Authorization"] = `Basic ${btoa(`${basicUser}:${basicPass}`)}`;
    bridgeHeaders["X-Bridge-Auth"] = `Bearer ${bridgeSecret}`;
  } else {
    bridgeHeaders["Authorization"] = `Bearer ${bridgeSecret}`;
  }

  const startedAt = Date.now();
  const payloadBody = JSON.stringify({ command: command.trim() });

  // 2 attempts (initial + 1 retry) on network error or 5xx.
  let bridgeRes: Response | null = null;
  let lastError: string | null = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await bridgeFetchOnce(bridgeUrl, bridgeHeaders, payloadBody, 15000);
      if (res.status >= 500 && attempt < 2) {
        lastError = `upstream ${res.status}`;
        await res.body?.cancel().catch(() => {});
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
      bridgeRes = res;
      break;
    } catch (e) {
      lastError = e instanceof Error ? e.message : "bridge fetch failed";
      console.warn(`[vps-exec] attempt ${attempt} failed:`, lastError);
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
    }
  }

  if (!bridgeRes) {
    await logCommand(supabase, user.id, command, -1, `UPSTREAM_UNAVAILABLE: ${lastError}`);
    return json(req, { error: "UPSTREAM_UNAVAILABLE", message: lastError ?? "bridge unreachable" }, 503);
  }

  const durationMs = Date.now() - startedAt;
  const rawBody = await bridgeRes.text();
  let payload: { exit_code?: number; stdout?: string; stderr?: string; duration_ms?: number } = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    payload = { stderr: rawBody };
  }

  const exitCode = typeof payload.exit_code === "number" ? payload.exit_code : (bridgeRes.ok ? 0 : -1);
  const stdout = payload.stdout ?? "";
  const stderr = payload.stderr ?? "";

  await logCommand(supabase, user.id, command, exitCode, stdout);

  return json(req, {
    exit_code: exitCode,
    stdout,
    stderr,
    duration_ms: payload.duration_ms ?? durationMs,
  }, 200);
}));
