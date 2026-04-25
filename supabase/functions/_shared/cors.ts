// Shared CORS helper for all edge functions.
// Reflects request Origin if it matches the allowlist (no wildcard `*`),
// always includes Access-Control-Allow-Methods (some browsers reject the
// preflight without it when the request carries Authorization).

const STATIC_ALLOWED = new Set<string>([
  "https://nexify-studio.tech",
  "https://cyber-weave-craft.lovable.app",
]);

const DYNAMIC_PATTERNS: RegExp[] = [
  // Any lovable.app subdomain (preview, sandbox, share, custom).
  /^https:\/\/[a-z0-9-]+(?:--[a-z0-9-]+)*\.lovable\.app$/i,
  // Lovable project preview alias.
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/i,
  // Local dev.
  /^http:\/\/localhost(?::\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/i,
];

const ALLOW_HEADERS =
  "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version";

const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  if (STATIC_ALLOWED.has(origin)) return true;
  return DYNAMIC_PATTERNS.some((re) => re.test(origin));
};

export const buildCorsHeaders = (req: Request): Record<string, string> => {
  const origin = req.headers.get("Origin");
  const allowOrigin = isAllowedOrigin(origin) ? origin! : "https://nexify-studio.tech";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": ALLOW_HEADERS,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
};

export const handlePreflight = (req: Request): Response | null => {
  if (req.method !== "OPTIONS") return null;
  return new Response(null, { status: 204, headers: buildCorsHeaders(req) });
};

export const json = (req: Request, body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...buildCorsHeaders(req), "Content-Type": "application/json" },
  });

export const withCors = async (
  req: Request,
  handler: () => Promise<Response>,
): Promise<Response> => {
  try {
    return await handler();
  } catch (e) {
    console.error("[withCors] unhandled:", e);
    const message = e instanceof Error ? e.message : String(e);
    return json(req, { error: "INTERNAL", message }, 500);
  }
};

// Convenience for places that need raw headers (e.g. SSE pass-through).
export const corsHeaders = (req: Request) => buildCorsHeaders(req);
