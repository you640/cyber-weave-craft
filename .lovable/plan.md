

User chce **admin dashboard** dostupný len pre `larsenevans@proton.me`, s prepracovaným UI na riadenie všetkého a **shell konzolou s MCP serverom + napojením na vlastný VPS**.

## VPS údaje (target pre shell + MCP bridge)

- **Host**: `194.182.87.6`
- **Port**: `22` (SSH)
- **OS**: Ubuntu 24
- **Users**: `tapfast` alebo `root`
- **Doména**: zatiaľ nepriradená — bridge bude počúvať priamo na IP cez HTTPS (self-signed alebo Caddy + Let's Encrypt s neskôr pridanou doménou)

> Heslo / SSH kľúč nikdy neukladáme do kódu ani do DB. Komunikácia Lovable Cloud ↔ VPS pôjde cez **shared bearer token** (`VPS_SHARED_SECRET`) na malý HTTP service bežiaci na VPS, nie cez priame SSH z edge funkcie.

## Realita check

**Čo sa dá:**
- Admin role systém (`user_roles` tabuľka + `has_role()` SECURITY DEFINER fn — povinný pattern, role NIKDY na profiles)
- `/dashboard` route chránený admin-guardom (redirect ak nie je admin)
- Prepracované admin UI vo wireframe štýle — users, attack stream stats, profile management, system health
- Web-based "shell" UI ktorá posiela príkazy cez edge function

**Čo NEJDE priamo z prehliadača (potrebuje VPS-side setup):**
- Skutočná SSH/shell konzola na VPS — prehliadač nemôže otvárať TCP/SSH spojenia. Musí to ísť cez **edge function → tvoj VPS endpoint** (malý HTTP API na VPS ktorý vykoná príkaz a vráti výstup, autentifikované cez shared secret)
- MCP server beží na tvojom VPS samostatne, edge function k nemu len volá HTTP/SSE

**Heslo do tabuľky neukladáme.** Auth heslo spravuje Lovable Cloud (hash, rotation, HIBP). Ty si ho nastavíš pri signup-e cez `/auth`. Email `larsenevans@proton.me` použijem na auto-priradenie admin role pri prvom prihlásení.

## Otázky pred štartom

1. Či shell konzolu chceš teraz (so stub backendom kým nasadíš `vps-bridge`) alebo počkáme až bude bridge live na `194.182.87.6`
2. Aké sekcie v admine sú priorita (users, attack feed, shell, MCP, settings — alebo aj content?)
3. Či chceš pre bridge použiť `tapfast` user (bezpečnejšie, sudo cez whitelist) alebo `root` (jednoduchšie, riskantnejšie)

## Plán

### 1. Database (migrácia)
- `app_role` enum (`admin`, `user`)
- `user_roles` tabuľka (id, user_id FK na auth.users, role, unique(user_id, role))
- `has_role(uuid, app_role)` SECURITY DEFINER fn
- RLS na `user_roles`: user vidí svoje role, admin vidí všetko
- Update `handle_new_user()`: ak `NEW.email = 'larsenevans@proton.me'` → INSERT do `user_roles` s rolou `admin`
- Pre už existujúceho usera (ak sa zaregistruje pred migráciou) — manuálny INSERT cez insert tool po jeho signup-e
- `admin_command_log` tabuľka — audit trail (admin_id, command, exit_code, stdout_snippet, created_at), RLS len admin select

### 2. Frontend — admin guard
- `useIsAdmin()` hook — query cez `.rpc('has_role', { _user_id, _role: 'admin' })`
- `<AdminRoute>` wrapper — loading state → redirect na `/auth` ak nie admin

### 3. `/dashboard` stránka — wireframe layout
Marker `// CONTROL · 11 · ADMIN`. Sidebar + main content layout.

**Sidebar (left, 240px)**:
- `[ OVERVIEW ]` — system health, counters
- `[ USERS ]` — zoznam profilov, role management
- `[ ATTACK FEED ]` — live stream + history
- `[ SHELL ]` — terminál (target: `tapfast@194.182.87.6`)
- `[ MCP ]` — status MCP servera + tools list
- `[ SETTINGS ]` — env, secrets info (read-only badges)

**Main panely** (každý = wireframe karta):
- **Overview**: 4 KPI counters (users total, sessions today, blocked attacks, VPS uptime), recent signups, mini sparkline
- **Users**: tabuľka (email, display_name, role, created_at, akcie: promote/demote)
- **Attack Feed**: AttackMap stream + tabuľka eventov + filter chips
- **Shell**: terminál UI — input riadok `tapfast@tapfast:~$ ` + output area (mono, dark soft bg). Pošle command na edge function `vps-exec`. Zobrazuje target `194.182.87.6:22` v statusbar
- **MCP**: zoznam dostupných MCP tools, ping status, last call log
- **Settings**: read-only env vars (len názvy), VPS connection info, secret rotation hint

### 4. Shell + VPS bridge

**Edge function `vps-exec`** (`supabase/functions/vps-exec/index.ts`):
- Validácia: musí byť admin (cez JWT `getClaims` + `has_role` rpc)
- Validácia inputu (Zod): `{ command: string (max 500), workdir?: string }`
- POST na `${VPS_BASE_URL}/exec` (napr. `https://194.182.87.6:8443/exec`) s `Authorization: Bearer ${VPS_SHARED_SECRET}`
- Vracia `{ stdout, stderr, exit_code, duration_ms }`
- CORS headers + audit log do `admin_command_log`

**Edge function `mcp-call`**:
- Proxy na MCP server na tvojom VPS (Streamable HTTP)
- Headers `Accept: application/json, text/event-stream` (povinné inak 406)
- Admin-only

**Secrets** (požiadam cez add_secret po schválení):
- `VPS_BASE_URL` — napr. `https://194.182.87.6:8443`
- `VPS_SHARED_SECRET` — bearer token (vygeneruješ napr. `openssl rand -hex 32` na VPS)
- `MCP_SERVER_URL` — URL MCP servera na VPS

**Čo musíš nasadiť na VPS `194.182.87.6`** (mimo Lovable, dokumentujem v chat-e po implementácii):

1. **`vps-bridge` HTTP service** na porte 8443:
   - Beží ako systemd unit pod userom `tapfast` (nie root!)
   - Validuje `Authorization: Bearer ${VPS_SHARED_SECRET}` (constant-time compare)
   - Whitelist príkazov (napr. `ls`, `df`, `free`, `systemctl status`, `docker ps`, `journalctl`, `cat /var/log/...`) — alebo aspoň blocklist nebezpečných (`rm -rf /`, fork bomby, `mkfs`, `dd of=/dev/`)
   - Spustí command s timeoutom 30s, max output 1MB
   - Vracia JSON `{stdout, stderr, exit_code, duration_ms}`
   - TLS: Caddy reverse-proxy (auto Let's Encrypt) keď bude doména, dovtedy self-signed cert + edge function ignoruje SSL verify (dočasne)

2. **MCP server** (mcp-lite alebo iný) prístupný cez HTTPS na osobitnom porte (napr. 8444), tiež za Caddy

3. **Firewall** (`ufw`):
   - SSH 22 — len z tvojej IP (alebo aspoň key-only auth)
   - 8443/8444 — open (chránené bearer tokenom)

### 5. Súbory

**Nové migrácie:**
- `app_role` enum + `user_roles` + `has_role()` + RLS + update `handle_new_user()` + `admin_command_log`

**Nové súbory:**
- `src/hooks/use-is-admin.ts`
- `src/components/auth/AdminRoute.tsx`
- `src/pages/Dashboard.tsx`
- `src/components/dashboard/DashboardLayout.tsx`
- `src/components/dashboard/panels/Overview.tsx`
- `src/components/dashboard/panels/Users.tsx`
- `src/components/dashboard/panels/AttackFeed.tsx`
- `src/components/dashboard/panels/Shell.tsx`
- `src/components/dashboard/panels/MCP.tsx`
- `src/components/dashboard/panels/Settings.tsx`
- `supabase/functions/vps-exec/index.ts`
- `supabase/functions/mcp-call/index.ts`

**Upravené:**
- `src/App.tsx` — `/dashboard` route v `<AdminRoute>`
- `src/components/auth/UserMenu.tsx` — `Admin →` link ak je admin

### 6. Bezpečnosť
- Role v separátnej tabuľke (NIKDY na profiles)
- `has_role` SECURITY DEFINER aby sa neopakovala RLS recursion
- Edge functions overujú admin v kóde (nie len JWT existence)
- VPS bridge: bearer auth + command whitelist + timeout + output cap + audit log
- VPS bridge beží ako `tapfast` user (nie `root`); sudo iba pre konkrétne whitelisted príkazy cez `/etc/sudoers.d/vps-bridge`
- Žiadne raw SQL z klienta, len typed RPC

### 7. Vizuál
1:1 wire estetika. Shell panel: darker `bg-[hsl(var(--wire-bg-soft))]`, blue prompt v štýle `tapfast@194.182.87.6:~$`, status bar dole s `● connected · 22ms · ubuntu 24.04`. Ostatné panely klasické `wire-border` + `wire-shadow`. Žiadne nové farby.
