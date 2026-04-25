# Plán: oprava CORS na vps-exec + 502 na mcp-call

## Root cause

**vps-exec CORS z `https://nexify-studio.tech`**
Funkcia má `Allow-Origin: *` ale **chýba `Access-Control-Allow-Methods`**. Niektoré browsery (najmä keď request nesie `Authorization`) preflight zamietnu.

**mcp-call 502**
Jediný `fetch()` na MCP server bez timeoutu a bez retry. Akýkoľvek prechodný network error → okamžitý 502.

## Zmeny

### 1. Nový shared modul `supabase/functions/_shared/cors.ts`
Allowlist (reflexia Origin, žiadny `*`):
- `https://nexify-studio.tech`
- `https://cyber-weave-craft.lovable.app`
- ľubovoľný `https://*.lovable.app` (preview + sandbox)
- `http://localhost:*` (dev)

Exporty:
- `buildCorsHeaders(req)` — reflektuje Origin ak je v allowliste, vždy obsahuje `Access-Control-Allow-Methods: POST, OPTIONS`, `Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type`, `Access-Control-Max-Age: 86400`, `Vary: Origin`.
- `handlePreflight(req)` — vráti 204 s CORS ak OPTIONS, inak `null`.
- `json(req, body, status)` — JSON response s CORS.
- `withCors(req, handler)` — top-level try/catch wrapper, garantuje CORS aj pri runtime chybe (`{ error: "INTERNAL", message }`, status 500).

### 2. `vps-exec/index.ts`
- Nahradiť lokálne `corsHeaders` shared helperom.
- Prvý riadok handlera: `const pre = handlePreflight(req); if (pre) return pre;`
- Telo handlera obaliť do `withCors(req, …)`.
- Všetky `new Response(JSON.stringify(...))` → `json(req, ..., status)`.
- Bridge fetch: ponechať existujúci 15s abort, **pridať 1 retry** (max 2 pokusy) na network error / 5xx, backoff 400 ms.
- Pri vyčerpanom retry → `json(req, { error: "UPSTREAM_UNAVAILABLE" }, 503)`.

### 3. `mcp-call/index.ts`
- To isté: shared CORS, `handlePreflight`, `withCors`.
- Pridať `AbortController` s **25 s timeout** okolo upstream `fetch`.
- **2 pokusy** (initial + 1 retry), 500 ms backoff, retry len na network error alebo upstream 5xx.
- SSE stream pass-through ostáva — retry sa NEpoužíva pre SSE.
- Pri vyčerpanom retry → `json(req, { error: "UPSTREAM_UNAVAILABLE" }, 503)`.
- Všetky error vetvy cez `json(req, …)`.

### 4. `vps-exec-live/index.ts` (kvôli konzistencii a aby dashboard shell ostal funkčný)
- Aplikovať shared CORS + `handlePreflight` + `withCors`.
- Existujúci 30s abort + jednorazový pokus ponechať (live shell, retry by spustil príkaz dvakrát — nebezpečné).

### 5. Frontend invoke guard

**`src/hooks/use-vps-exec.ts`**
- Pred `supabase.functions.invoke(...)`:
  ```ts
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { setState({ data: null, error: "NOT_AUTHENTICATED", loading: false }); return null; }
  ```
- Mapovať response error: ak msg obsahuje `UPSTREAM_UNAVAILABLE` alebo `BRIDGE_ERROR` → friendly text `"Backend dočasne nedostupný, skús znovu o chvíľu."`.

**`src/components/dashboard/panels/HealthPanel.tsx`**
- Pridať banner pre `error === "NOT_AUTHENTICATED"` s linkom `[ prihlásiť sa ]` (`/auth`). Inak žiadna úprava — chybové texty z hooku sa zobrazia v existujúcom `[ ERROR ]` strip.

**`src/components/dashboard/panels/McpPanel.tsx`**
- V `callMcp` pred `invoke`: rovnaký session check. Ak nie je session, throw `Error` s `code: "NOT_AUTHENTICATED"`.
- Stav `error` zobrazí: ak `NOT_AUTHENTICATED` → CTA `[ prihlásiť sa → /auth ]`; ak `UPSTREAM_UNAVAILABLE` → `"MCP server dočasne nedostupný."`.

### 6. Deploy + verify
- Deploy `vps-exec`, `mcp-call`, `vps-exec-live` cez `supabase--deploy_edge_functions`.
- Curl OPTIONS preflight pre obe, raz s `Origin: https://nexify-studio.tech`, raz s lovable preview origin → očakávame 204 + reflektovaný `Access-Control-Allow-Origin` + `Access-Control-Allow-Methods: POST, OPTIONS`.
- Curl POST `vps-exec` bez auth → 401 JSON **s** CORS hlavičkami.
- Skontrolovať `mcp-call` logy po teste (timeout/retry sa loguje).
- Stručný report v chate: root cause, čo opravené, zostávajúce riziká.

## Zostávajúce riziká
- Ak je MCP server (194.182.87.6:8443) skutočne down, retry nepomôže — užívateľ uvidí `UPSTREAM_UNAVAILABLE`. To je správne správanie.
- 25s timeout je dosť pre väčšinu tool calls; extrémne dlhé operácie treba presunúť na SSE stream.
- Allowlist hardcoded v `_shared/cors.ts` — pri pridaní novej domény treba upraviť tento súbor.