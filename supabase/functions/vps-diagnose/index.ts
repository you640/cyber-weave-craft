import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface StepResult {
  step: string;
  ok: boolean;
  status?: number;
  duration_ms: number;
  response_preview?: string;
  error?: string;
  hint?: string;
}

async function runStep(
  label: string,
  fn: () => Promise<{ status: number; bodyText: string }>,
): Promise<StepResult> {
  const t0 = Date.now();
  try {
    const { status, bodyText } = await fn();
    const duration = Date.now() - t0;
    let hint: string | undefined;
    if (status === 401) hint = "AUTH_FAILED — Bearer token alebo Basic Auth nesúhlasí. Skontroluj VPS_SHARED_SECRET a Caddy basicauth blok.";
    else if (status === 403) hint = "FORBIDDEN — server prijal auth, ale príkaz/cesta je zakázaná.";
    else if (status === 404) hint = "NOT_FOUND — endpoint neexistuje. Skontroluj Caddyfile reverse_proxy.";
    else if (status >= 500) hint = "BRIDGE_ERROR — bridge alebo wrapper script zlyhal. Pozri journalctl -u exec-bridge.";
    return {
      step: label,
      ok: status >= 200 && status < 300,
      status,
      duration_ms: duration,
      response_preview: bodyText.slice(0, 1000),
      hint,
    };
  } catch (e) {
    const duration = Date.now() - t0;
    const msg = e instanceof Error ? e.message : String(e);
    let hint: string | undefined;
    if (msg.includes("abort")) hint = "TIMEOUT — bridge neodpovedal do 10s. Skontroluj firewall a `systemctl status caddy exec-bridge`.";
    else if (msg.toLowerCase().includes("certificate") || msg.toLowerCase().includes("tls")) hint = "TLS_ERROR — problém s SSL certifikátom domény.";
    else if (msg.toLowerCase().includes("dns") || msg.toLowerCase().includes("resolve")) hint = "DNS_ERROR — exec.nexify-studio.tech sa nedá resolvnúť.";
    else hint = "NETWORK_ERROR — bridge je nedostupný (down, blocked, alebo zlá URL).";
    return { step: label, ok: false, duration_ms: duration, error: msg, hint };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // 1) Auth + admin gate
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userData.user.id, _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2) Read secrets
    const bridgeUrl = Deno.env.get("VPS_BRIDGE_URL"); // e.g. https://exec.nexify-studio.tech/exec
    const bridgeSecret = Deno.env.get("VPS_SHARED_SECRET");
    const basicUser = Deno.env.get("VPS_BASIC_USER"); // optional
    const basicPass = Deno.env.get("VPS_BASIC_PASS"); // optional

    const config = {
      VPS_BRIDGE_URL: bridgeUrl ? "✓ set" : "✗ MISSING",
      VPS_SHARED_SECRET: bridgeSecret ? `✓ set (len=${bridgeSecret.length})` : "✗ MISSING",
      VPS_BASIC_USER: basicUser ? "✓ set" : "○ not set (optional)",
      VPS_BASIC_PASS: basicPass ? "✓ set" : "○ not set (optional)",
    };

    if (!bridgeUrl || !bridgeSecret) {
      return new Response(JSON.stringify({
        config,
        steps: [],
        fatal: "Chýbajú VPS_BRIDGE_URL alebo VPS_SHARED_SECRET v edge function secrets.",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Derive base URL (strip /exec if present)
    let baseUrl = bridgeUrl.replace(/\/exec\/?$/, "");
    const execUrl = bridgeUrl.endsWith("/exec") ? bridgeUrl : `${bridgeUrl.replace(/\/$/, "")}/exec`;
    const healthUrl = `${baseUrl}/health`;

    const steps: StepResult[] = [];

    // STEP 1 — Public health check (no auth)
    steps.push(await runStep("GET /health (no auth)", async () => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 10000);
      try {
        const r = await fetch(healthUrl, { method: "GET", signal: ctrl.signal });
        const text = await r.text();
        return { status: r.status, bodyText: text };
      } finally { clearTimeout(t); }
    }));

    // Build auth headers
    const buildHeaders = (mode: "bearer" | "basic" | "both"): Record<string, string> => {
      const h: Record<string, string> = { "Content-Type": "application/json" };
      if (mode === "bearer" || mode === "both") h["Authorization"] = `Bearer ${bridgeSecret}`;
      if ((mode === "basic" || mode === "both") && basicUser && basicPass) {
        // If "both", Basic header overrides Bearer (single Authorization header).
        // For "both" we instead send Bearer in Authorization and Basic in X-Basic-Auth (Caddy basicauth uses Authorization).
        if (mode === "both") {
          // Caddy basicauth REQUIRES Basic on Authorization. So in "both" we override with Basic and put Bearer in X-Bridge-Auth.
          h["Authorization"] = `Basic ${btoa(`${basicUser}:${basicPass}`)}`;
          h["X-Bridge-Auth"] = `Bearer ${bridgeSecret}`;
        } else {
          h["Authorization"] = `Basic ${btoa(`${basicUser}:${basicPass}`)}`;
        }
      }
      return h;
    };

    // STEP 2 — POST /exec with Bearer only (current production path; assumes Caddy strips+re-adds)
    steps.push(await runStep("POST /exec (Bearer only)", async () => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);
      try {
        const r = await fetch(execUrl, {
          method: "POST",
          headers: buildHeaders("bearer"),
          body: JSON.stringify({ command: "nexify-health" }),
          signal: ctrl.signal,
        });
        const text = await r.text();
        return { status: r.status, bodyText: text };
      } finally { clearTimeout(t); }
    }));

    // STEP 3 — POST /exec with Basic only (if basic creds configured)
    if (basicUser && basicPass) {
      steps.push(await runStep("POST /exec (Basic only)", async () => {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 12000);
        try {
          const r = await fetch(execUrl, {
            method: "POST",
            headers: buildHeaders("basic"),
            body: JSON.stringify({ command: "nexify-health" }),
            signal: ctrl.signal,
          });
          const text = await r.text();
          return { status: r.status, bodyText: text };
        } finally { clearTimeout(t); }
      }));

      // STEP 4 — POST /exec with Basic on Authorization + Bearer on X-Bridge-Auth
      steps.push(await runStep("POST /exec (Basic + Bearer via X-Bridge-Auth)", async () => {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 12000);
        try {
          const r = await fetch(execUrl, {
            method: "POST",
            headers: buildHeaders("both"),
            body: JSON.stringify({ command: "nexify-health" }),
            signal: ctrl.signal,
          });
          const text = await r.text();
          return { status: r.status, bodyText: text };
        } finally { clearTimeout(t); }
      }));
    }

    // Summary
    const okStep = steps.find((s) => s.ok && s.step.startsWith("POST /exec"));
    const recommendation = okStep
      ? `✓ Funguje cez "${okStep.step}". V vps-exec edge funkcii používaj rovnakú auth schému.`
      : `✗ Žiadny POST /exec variant neprešiel. Skontroluj Caddyfile (basicauth + reverse_proxy + Authorization hlavičky) a "systemctl status exec-bridge".`;

    return new Response(JSON.stringify({
      config,
      derived: { healthUrl, execUrl },
      steps,
      recommendation,
    }, null, 2), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: "Internal error", message: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
