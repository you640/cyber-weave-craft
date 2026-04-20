

## Plán: Nexify Security Dashboard — Health, WP Audit, Reports

Užívateľ schválil: proxy cez `vps-exec`, wrapper scripty na VPS, plný rozsah 3 panelov, Caddy spravuje oba auth (proxy strip a re-add).

### Architektúra

```text
Browser (admin) → vps-exec edge fn → Caddy (Basic Auth) → bridge (Bearer) → wrapper script
                  ↑ overí admin rolu   ↑ pridá Basic     ↑ pridá Bearer    ↑ vráti JSON/text
                  ↑ allowlist          ↑ strip+re-add Authorization
```

Keďže Caddy spraví Basic Auth check a potom strip+re-add Authorization, edge fn pošle **iba** `Authorization: Bearer <SHARED_SECRET>` na Caddy. Caddy overí Basic (s creds vloženými do URL alebo cez druhý mechanizmus — v Caddyfile snippete), strip Authorization, re-add Bearer dovnútra k bridgeu. Edge fn teda nepotrebuje Basic Auth secret.

→ **Treba len jeden secret**: `VPS_BRIDGE_URL` a `VPS_SHARED_SECRET` (oba už existujú podľa predchádzajúcich krokov). Žiadny nový secret.

### Zmeny v kóde

**1. `supabase/functions/vps-exec/index.ts`** — rozšíriť allowlist:
- Pridať jednotokenové príkazy: `nexify-health`, `nexify-wp-audit-start`, `nexify-wp-audit-status`, `nexify-list-reports`, `nexify-latest-report`
- Žiadna zmena auth logiky (Caddy to vyrieši)

**2. Nové dashboard panely**:
- `src/components/dashboard/panels/HealthPanel.tsx` — auto-refresh 10s, parsuje výstup `nexify-health` (CPU load, RAM used/total, disk used/total), brutalist karty s `wire-border` + glassmorphism `backdrop-blur-sm bg-background/60`
- `src/components/dashboard/panels/WpAuditPanel.tsx` — tlačidlo "RUN ENTERPRISE AUDIT" (`nexify-wp-audit-start`), status pill (`nexify-wp-audit-status`, refresh 5s), toast feedback, posledný journal output v `<pre>`
- `src/components/dashboard/panels/ReportsPanel.tsx` — sidebar so zoznamom (`nexify-list-reports`), default load `nexify-latest-report`, JSON parse → tabuľka CVE / CVSS badge (zelená <4 / oranžová 4-7 / červená ≥7) / CWE / popis / odkaz na NVD; raw JSON toggle

**3. `src/components/dashboard/AdminSidebar.tsx`** — nahradiť `active: false` u Users/Attack Feed/Settings (nedotýkam sa), pridať 3 nové aktívne položky: Health, WP Audit, Reports

**4. `src/pages/Dashboard.tsx`** — pridať 3 nové routy: `/dashboard/health`, `/dashboard/wp-audit`, `/dashboard/reports`

**5. Helper hook** `src/hooks/use-vps-exec.ts` — wrapper okolo `supabase.functions.invoke('vps-exec', { body: { command } })` s loading/error/data state, používaný všetkými 3 panelmi

### VPS setup dokument

Vygenerujem `/mnt/documents/nexify-vps-setup.md` s presným obsahom:
- 5 wrapper scriptov pre `/usr/local/bin/`
- Sudoers entry pre `execbridge`
- ACL/group setup pre čítanie `/home/wp-audit/reports/`
- Caddyfile snippet pre Authorization strip+re-add (na bridge endpoint `/exec`)
- Reštart príkazy (`systemctl reload caddy`, `systemctl restart exec-bridge`)
- Curl test príklady

### Štýl

Dodržím existujúci wireframe systém (`wire-border`, `wire-shadow`, `wire-dots`, `font-mono`, sekcia markery `// HEALTH · 12` atď.). CVSS badge použijú existujúce `bg-destructive` (červená) + nové utility triedy v rámci komponentu pre zelená/šedá. Žiadne nové fonty ani globálne tokens.

### Po implementácii
- Ty na VPS spustíš setup z `nexify-vps-setup.md`
- E2E test: `/dashboard/health` (CPU/RAM zobrazenie) → `/dashboard/wp-audit` (klik Run) → `/dashboard/reports` (CVE tabuľka)

