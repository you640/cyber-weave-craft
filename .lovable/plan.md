User chce minimálny scope: DB + guard + základný dashboard layout. Žiadny shell/MCP/users zatiaľ.

## Plán: Admin foundation (krok 1/2)

### 1. Database migrácia

- `app_role` enum: `'admin'`, `'user'`
- `user_roles` tabuľka: `id`, `user_id` (uuid, FK na auth.users s ON DELETE CASCADE), `role` (app_role), `created_at`, UNIQUE(user_id, role)
- RLS enabled, policy: user vidí svoje role (`auth.uid() = user_id`), admin vidí všetko
- `has_role(_user_id uuid, _role app_role)` → SECURITY DEFINER, STABLE, search_path=public
- Update `handle_new_user()`: ak `NEW.email = 'larsenevans@proton.me'` → INSERT do `user_roles` (admin), inak (user)
- `admin_command_log` tabuľka: `id`, `admin_id` (uuid), `command` (text), `exit_code` (int), `stdout_snippet` (text), `created_at`. RLS: len admin SELECT, len admin INSERT (cez `has_role`)
- Po migrácii spustím manuálny INSERT pre `larsenevans@proton.me` ak už existuje v `auth.users` (cez insert tool, lookup id z profiles)

### 2. Frontend — admin infra

- `src/hooks/use-is-admin.ts`: použije `useAuth()`, volá `supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })`, vracia `{ isAdmin, loading }`
- `src/components/auth/AdminRoute.tsx`: wrapper, kým loading → wireframe loading state, ak nie admin → `<Navigate to="/auth" replace>`, inak children

### 3. Dashboard UI (len kostra)

- `src/pages/Dashboard.tsx`: `<SidebarProvider>` + `<AdminSidebar>` + main content s `<Overview />` panelom. Používa `<PageShell>` style ale custom (lebo má sidebar)
- `src/components/dashboard/AdminSidebar.tsx`: shadcn sidebar, `collapsible="icon"`, items: Overview (active), Users, Attack Feed, Shell, MCP, Settings — všetky okrem Overview majú badge `[ SOON ]` a sú disabled. Marker `// CONTROL · 11`
- `src/components/dashboard/panels/Overview.tsx`:
  - Header: `// OVERVIEW · 01` + "Riadiace centrum"
  - 4 KPI karty (wire-border): "Používatelia spolu", "Profily dnes", "Útoky zablokované", "VPS uptime" — počítače reálne kde to ide:
    - users total: `select count(*) from profiles`
    - profiles today: `select count(*) from profiles where created_at > current_date`
    - útoky: placeholder `—` (nemáme persisted data)
    - uptime: placeholder `—` (nie je bridge ešte)
  - Recent signups list (posledných 5 z `profiles`, email + relative time)
  - Statusbar dole: `● admin · ${user.email} · session aktívna`

### 4. Routing

- `src/App.tsx`: pridať `<Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />`
- `src/components/auth/UserMenu.tsx`: ak `isAdmin` → pridať `Admin →` link na `/dashboard` v dropdowne

### Súbory

**Nové:**

- migrácia (app_role, user_roles, has_role, admin_command_log, update handle_new_user)
- `src/hooks/use-is-admin.ts`
- `src/components/auth/AdminRoute.tsx`
- `src/pages/Dashboard.tsx`
- `src/components/dashboard/AdminSidebar.tsx`
- `src/components/dashboard/panels/Overview.tsx`

**Upravené:**

- `src/App.tsx` (route)
- `src/components/auth/UserMenu.tsx` (Admin link)

### Vizuál

1:1 wire estetika. Sidebar má `wire-border-r`, mono labely, blue active state. KPI karty `wire-border wire-shadow`, big number v `font-mono text-4xl`, label v `text-[10px] tracking-[0.2em] uppercase`. Disabled sidebar items majú `opacity-40` + `[ SOON ]` badge.

### Bezpečnosť

- Role v separátnej tabuľke (NIKDY na profiles) ✓
- `has_role` SECURITY DEFINER (no RLS recursion) ✓
- `AdminRoute` overuje cez RPC, nie cez client-side hardcoded email ✓
- `admin_command_log` RLS: select+insert len pre adminov ✓  
  
+ MCP a napojenie s vlastnny VPS to mus byt ! 