

## Plán: Shell panel + vps-exec edge funkcia

### 1. Edge funkcia `supabase/functions/vps-exec/index.ts`
- Auth: Bearer JWT → `getUser()` → `has_role(user.id, 'admin')`. Inak 401/403.
- Validácia tela (zod): `{ command: string (1-500 znakov) }`.
- **Whitelist** (server-side, hardcoded set povolených base príkazov):
  ```
  uptime, whoami, hostname, date, df, free, uname,
  systemctl status, systemctl is-active, journalctl --no-pager -n,
  ps aux, top -bn1, ss -tulpn, netstat -tulpn,
  ls, cat, tail, head, grep, wc,
  docker ps, docker logs, docker stats --no-stream,
  ufw status, who, w, id
  ```
  - Parser: rozsekne na tokeny, vezme prvý (alebo prvé dva pre `systemctl status`, `docker ps` atď.) a porovná s množinou. Žiadne `;`, `&&`, `|`, `` ` ``, `$(`, `>`, `<`, newline. Inak 400 `BLOCKED`.
- Ak `VPS_BRIDGE_URL` + `VPS_SHARED_SECRET` nie sú nastavené → 503 `BRIDGE_NOT_CONFIGURED` (panel to ukáže pekne).
- POST na `${VPS_BRIDGE_URL}` s `Authorization: Bearer ${VPS_SHARED_SECRET}` a `{ command }`. Timeout 15s (`AbortController`).
- Bridge vráti `{ exit_code, stdout, stderr, duration_ms }`.
- **Audit log**: insert do `admin_command_log` (`admin_id`, `command`, `exit_code`, `stdout_snippet` = prvých 500 znakov stdout). Insert ide cez user-scoped klienta (RLS vyžaduje `auth.uid() = admin_id`).
- Response: `{ exit_code, stdout, stderr, duration_ms }`.
- Config: pridať `[functions.vps-exec] verify_jwt = false` do `supabase/config.toml` (validujeme v kóde).

### 2. Shell panel `src/components/dashboard/panels/ShellPanel.tsx`
- Header: `// SHELL · 03` + "Vzdialený terminál · 194.182.87.6".
- **Status pásik** (wire-border): probe `whoami` pri mount → `[ ONLINE / NOT CONFIGURED / ERROR ]` + last-seen čas.
- **Terminálová karta** (wire-border, `bg-[hsl(var(--wire-bg-soft))]`, font-mono):
  - Scrollovateľná história (output blokov: prompt riadok `tapfast@vps:~$ <cmd>` v primary, stdout v foreground, stderr v destructive, exit code badge).
  - Input riadok dole: `$` prefix + `<input>` + Enter na execute. Disabled počas pending. Šípka hore → predošlý príkaz (lokálna history).
- **Quick actions** (chip tlačidlá): `uptime`, `df -h`, `free -h`, `systemctl status caddy`, `docker ps`. Klik → predvyplní + spustí.
- **Whitelist info** (collapsible): zoznam povolených príkazov, marker `// POLICY · ALLOWLIST`.
- **Recent commands** (vpravo / pod): posledných 10 z `admin_command_log` (select cez supabase client, RLS to obmedzí na adminov), refresh po každom exec.
- Error handling: 400 BLOCKED → červený inline hint "[ BLOCKED · príkaz nie je v allowliste ]", 503 → "[ BRIDGE NOT CONFIGURED · doplň VPS_BRIDGE_URL a VPS_SHARED_SECRET ]" + odkaz čo nastaviť.

### 3. Sidebar + routing
- `AdminSidebar.tsx`: Shell položka aktívna, `url: "/dashboard/shell"`, ikona `Terminal`. Odstrániť `[ SOON ]`.
- `Dashboard.tsx`: pridať `<Route path="shell" element={<ShellPanel />} />`.

### Súbory

**Nové:**
- `supabase/functions/vps-exec/index.ts`
- `src/components/dashboard/panels/ShellPanel.tsx`

**Upravené:**
- `supabase/config.toml` (`[functions.vps-exec] verify_jwt = false`)
- `src/components/dashboard/AdminSidebar.tsx` (Shell aktívny)
- `src/pages/Dashboard.tsx` (route `shell`)

### Bezpečnosť
- Admin-only cez `has_role` RPC v edge funkcii ✓
- Server-side allowlist + zákaz shell metaznakov ✓
- Audit log každého pokusu (vrátane BLOCKED → log s `exit_code = -1`) ✓
- Timeout 15s, max stdout snippet 500 znakov ✓
- Žiadne secrets v kóde, všetko cez `Deno.env` ✓

### Potrebné secrets (panel ich vypýta runtime)
- `VPS_BRIDGE_URL` — napr. `https://vps.tapfast.tld/exec` (bridge na VPS, port 8443 cez Caddy)
- `VPS_SHARED_SECRET` — bearer token, ktorý bridge očakáva

Doplníš ich neskôr — kým nie sú, panel ukáže `[ BRIDGE NOT CONFIGURED ]`.

