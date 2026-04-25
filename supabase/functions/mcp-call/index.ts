// MCP proxy edge function — Streamable HTTP transport
// Forwards JSON-RPC payloads to a self-hosted MCP server.
// Admin-only: validates JWT + checks user_roles.admin via has_role RPC.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { buildCorsHeaders, handlePreflight, json, withCors } from "../_shared/cors.ts";

const UPSTREAM_TIMEOUT_MS = 25000;
const RETRY_BACKOFF_MS = 500;

async function upstreamFetchOnce(
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

  if (req.method !== "POST") return json(req, { error: "Method not allowed" }, 405);

  // --- Auth: require logged-in admin ---
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json(req, { error: "Missing Authorization bearer token" }, 401);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return json(req, { error: "Invalid session" }, 401);

  const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });
  if (roleError) return json(req, { error: "Role check failed" }, 500);
  if (!isAdmin) return json(req, { error: "Forbidden — admin only" }, 403);

  // --- Config ---
  const MCP_SERVER_URL = Deno.env.get("MCP_SERVER_URL");
  const MCP_SERVER_TOKEN = Deno.env.get("MCP_SERVER_TOKEN");
  if (!MCP_SERVER_URL) {
    return json(req, {
      error: "MCP_NOT_CONFIGURED",
      message: "MCP_SERVER_URL secret is not set. Add it in Lovable Cloud → Secrets.",
    }, 503);
  }

  // --- Parse JSON-RPC body ---
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json(req, { error: "Invalid JSON body" }, 400);
  }
  const payloadBody = JSON.stringify(payload);

  const upstreamHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (MCP_SERVER_TOKEN) {
    upstreamHeaders["Authorization"] = `Bearer ${MCP_SERVER_TOKEN}`;
  }

  // --- 2 attempts (initial + 1 retry) on network error or 5xx, NOT for SSE responses ---
  let upstream: Response | null = null;
  let lastError: string | null = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await upstreamFetchOnce(MCP_SERVER_URL, upstreamHeaders, payloadBody, UPSTREAM_TIMEOUT_MS);
      if (res.status >= 500 && attempt < 2) {
        lastError = `upstream ${res.status}`;
        await res.body?.cancel().catch(() => {});
        await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS));
        continue;
      }
      upstream = res;
      break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[mcp-call] attempt ${attempt} failed:`, lastError);
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS));
        continue;
      }
    }
  }

  if (!upstream) {
    return json(req, { error: "UPSTREAM_UNAVAILABLE", message: lastError ?? "upstream unreachable" }, 503);
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  const cors = buildCorsHeaders(req);

  // SSE stream → pass through with CORS attached
  if (contentType.includes("text/event-stream")) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...cors, "Content-Type": "text/event-stream" },
    });
  }

  // JSON or text → parse & forward
  const text = await upstream.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    /* keep as text */
  }

  return new Response(
    typeof parsed === "string" ? parsed : JSON.stringify(parsed),
    {
      status: upstream.status,
      headers: {
        ...cors,
        "Content-Type": contentType.includes("json") ? "application/json" : "text/plain",
      },
    },
  );
}));
