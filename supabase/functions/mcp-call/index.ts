// MCP proxy edge function — Streamable HTTP transport
// Forwards JSON-RPC payloads to a self-hosted MCP server (e.g. on the user's VPS)
// Admin-only: validates JWT + checks user_roles.admin via has_role RPC.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // --- Auth: require logged-in admin ---
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Missing Authorization bearer token" }, 401);

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return json({ error: "Invalid session" }, 401);

  const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });
  if (roleError) return json({ error: "Role check failed" }, 500);
  if (!isAdmin) return json({ error: "Forbidden — admin only" }, 403);

  // --- Config check ---
  const MCP_SERVER_URL = Deno.env.get("MCP_SERVER_URL");
  const MCP_SERVER_TOKEN = Deno.env.get("MCP_SERVER_TOKEN");
  if (!MCP_SERVER_URL) {
    return json(
      {
        error: "MCP_NOT_CONFIGURED",
        message:
          "MCP_SERVER_URL secret is not set. Add it in Lovable Cloud → Secrets.",
      },
      503,
    );
  }

  // --- Parse JSON-RPC body ---
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // --- Forward to MCP server (Streamable HTTP requires both Accept types) ---
  const upstreamHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (MCP_SERVER_TOKEN) {
    upstreamHeaders["Authorization"] = `Bearer ${MCP_SERVER_TOKEN}`;
  }

  let upstream: Response;
  try {
    upstream = await fetch(MCP_SERVER_URL, {
      method: "POST",
      headers: upstreamHeaders,
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return json(
      {
        error: "UPSTREAM_UNREACHABLE",
        message: err instanceof Error ? err.message : String(err),
      },
      502,
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "";

  // SSE stream → pass through
  if (contentType.includes("text/event-stream")) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
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
        ...corsHeaders,
        "Content-Type": contentType.includes("json")
          ? "application/json"
          : "text/plain",
      },
    },
  );
});
