## /dashboard mega upgrade — Linear/Vercel vibe

Cieľ: posunúť admin dashboard z čisto wire/mono terminálu k modernému Linear/Vercel admin-u — jemnejšie povrchy, lepšia hierarchia, živé KPI, čisté error/empty stavy, lepšia navigácia. Wire akcenty (mono font, hranaté borders) zostávajú ako brand detail, ale prestávajú dominovať.

### 1. Design system tweaks (`src/index.css`, `tailwind.config.ts`)
- Pridať nové semantické tokeny: `--surface`, `--surface-elevated`, `--surface-muted`, `--border-subtle`, `--border-strong`, `--ring-focus`.
- Stavové farby: `--success`, `--warning`, `--danger`, `--info` + `-foreground` varianty (HSL).
- Jemné gradienty: `--gradient-panel`, `--gradient-accent` pre KPI karty a hero strip.
- Soft shadow utility (`wire-shadow-soft`) a `radius-card` (8–10px) — wire-border ostáva pre špeciálne akcenty.

### 2. Shell & navigácia (`Dashboard.tsx`, `AdminSidebar.tsx`)
- Header: sticky, ľavá strana = breadcrumb (Dashboard › Health), pravá = global search (⌘K placeholder), notif bell, UserMenu.
- Sidebar:
  - Zoskupiť do sekcií: **Monitor** (Overview, Health, Diagnostics), **Audit** (WP Audit, Reports), **Ops** (Shell, Shell Live, MCP), **Security** (MFA), **Coming soon** (Users, Attack Feed, Settings).
  - Active stav: ľavý 2px accent bar + jemný surface highlight (nie bracketed text).
  - Collapsed mode: tooltipy s názvom.
  - Mobile: off-canvas drawer cez `SidebarTrigger`.
- Footer sidebaru: status pill (cloud/edge health) + verzia buildu.

### 3. Overview redesign (`panels/Overview.tsx`)
Nahradiť statický obsah živým prehľadom:
- **KPI row (4 karty)**: Uptime, Aktívne hrozby (z attack-stream), Posledný WP audit score, Edge fn health. Každá karta = label, veľké číslo, delta vs. predošlé obdobie, mini sparkline.
- **Activity feed**: posledných 8 udalostí (audit, shell run, MCP call) — kompaktný list s ikonou, časom, statusom.
- **Quick actions**: 3 tlačidlá (Run WP audit, Open shell, Probe MCP).
- **System status grid**: bento 2×2 — Edge functions, Database, MCP, VPS bridge; každý s farebným dotom + ms latency.

### 4. Panely – funkčný + vizuálny polish
- **HealthPanel**: jednotný PageHeader, status karty so semantickými farbami (success/warn/danger), retry button, jasný empty + auth CTA.
- **McpPanel**: rozdeliť na Tabs (Tools / Console / Logs), status pill v headeri, presety ako chipy, lepšia JSON edit zóna (mono font + line numbers cez `<pre>` overlay).
- **ShellPanel / ShellLivePanel**: terminálové okno s tmavým surface, sticky príkazová lišta, history sidebar.
- **WpAuditPanel / ReportsPanel / DiagnosticsPanel**: konzistentný PageHeader + Card layout, prázdne stavy s ilustráciou (jednoduchý SVG/dot pattern) a primárnym CTA.
- **MfaPanel**: jasné stepper UI pre enroll, recovery codes v `monospace` boxe s copy/download.

### 5. Shared building blocks (nové komponenty)
- `components/dashboard/ui/PageHeader.tsx` — eyebrow, title, description, actions slot.
- `components/dashboard/ui/StatCard.tsx` — KPI karta s deltou a sparkline.
- `components/dashboard/ui/StatusPill.tsx` — semantický pill (idle/ok/warn/err/loading).
- `components/dashboard/ui/EmptyState.tsx` — ikona, title, popis, CTA.
- `components/dashboard/ui/SectionCard.tsx` — surface + header + content slot.
Všetky panely refaktorovať na tieto bloky → konzistencia.

### 6. Mikrointerakcie
- Fade/slide-in panelov pri route change (Framer Motion alebo CSS keyframes).
- Hover lift na KPI kartách (`translate-y-[-2px]`, soft shadow).
- Skeleton loadery namiesto „[ loading… ]“ textov.

### 7. Responsive
- Sidebar: na <768px collapsed default, otvára sa cez trigger.
- KPI grid: 1 / 2 / 4 stĺpce.
- Header: search sa skrýva na mobile, ostáva icon button.

### 8. Out of scope
- Žiadne zmeny v backend logike, edge functions, RLS ani schéme.
- Žiadne zmeny landing page.
- Žiadne nové integrácie/secrets.

### Súbory ktoré sa zmenia
- `src/index.css`, `tailwind.config.ts`
- `src/pages/Dashboard.tsx`
- `src/components/dashboard/AdminSidebar.tsx`
- `src/components/dashboard/panels/*` (všetky)
- Nové: `src/components/dashboard/ui/{PageHeader,StatCard,StatusPill,EmptyState,SectionCard}.tsx`

### Riziká
- Veľký vizuálny diff — môže pôsobiť ako „iná appka“. Wire akcenty (mono labels, bracketed CTA) zámerne nechám na pár miestach, aby zostal brand kontinuálny.
- KPI dáta: ak nemáme reálne metriky pre uptime/edge health, prvá verzia použije mock + TODO hook na neskôr (bez backend zmien).
