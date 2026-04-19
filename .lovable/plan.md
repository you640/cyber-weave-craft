

User chce pridať social sign-in (Google, Apple, Microsoft, GitHub). Potrebujem skontrolovať čo Lovable Cloud podporuje natívne:

- **Google** ✅ natívne podporovaný
- **Apple** ✅ natívne podporovaný
- **Microsoft** ❌ nie je v zozname natívne podporovaných (Email, Phone, Google, Apple, SSO/SAML)
- **GitHub** ❌ nie je natívne podporovaný v Lovable Cloud

Aktuálne v projekte **neexistuje žiadny auth flow** — žiadny `/auth` route, žiadne login/signup formuláre, žiadne profily, žiadny chránený obsah. WireNav má len mock "Login" tlačidlo bez funkcie. Treba postaviť auth od nuly.

Tiež sa potrebujem opýtať na profily a use case predtým ako začnem stavať.

## Plán: Pridať social sign-in (Google + Apple)

### Realita: čo sa dá a čo nie

Lovable Cloud natívne podporuje len **Google + Apple** (+ Email/Phone/SAML). 
**Microsoft a GitHub nie sú podporované** — pridanie by vyžadovalo rozpojiť Lovable Cloud a pripojiť externý Supabase projekt, čo zničí súčasné nastavenie. Odporúčam ich vynechať a ísť s Google + Apple, prípadne doplniť email/heslo ako fallback.

### Otvorené otázky pred implementáciou

Potrebujem od teba 2-3 rozhodnutia (pýtam sa nižšie cez kartičky), ale toto je smerový plán.

### Čo postavím

**1. Auth infrastructure (Lovable Cloud)**
- Cez "Configure Social Login" tool aktivujem Google + Apple cez `lovable.auth.signInWithOAuth()`
- Vygeneruje sa `src/integrations/lovable/` modul (managed OAuth, žiadne kľúče netreba)

**2. Nová stránka `/auth`**
- Wireframe štýl 1:1 s zvyškom stránky (`wire-border`, mono labely, dashed dividery, blue akcent)
- Marker `// ACCESS · 10`
- 2-stĺpcový layout:
  - **Ľavý panel:** value-prop copy ("prihlás sa do dispečingu", live counter mini-widget, čo dostaneš po prihlásení)
  - **Pravý panel:** auth karta s tlačidlami:
    - `[ Pokračovať cez Google → ]`
    - `[ Pokračovať cez Apple → ]`
    - dashed divider "alebo"
    - email + heslo formulár (sign-in / sign-up tab toggle)
- Po úspechu: redirect na `/` (alebo `/dashboard` ak ho neskôr postavíme)

**3. Auth state management**
- Hook `useAuth()` v `src/hooks/use-auth.ts`:
  - `onAuthStateChange` listener (nastavený PRED `getSession()`)
  - vracia `{ user, session, loading, signOut }`
- React Context `AuthProvider` v `App.tsx` aby celá appka videla session

**4. Aktualizácia `WireNav.tsx`**
- Mock "Login" tlačidlo → reálny `<Link to="/auth">Login</Link>`
- Keď je user prihlásený: zobraziť `[ user@email.com ▾ ]` dropdown s "Odhlásiť sa"
- Mobilná verzia rovnako

**5. Profile table (ak povieš áno na otázku #1)**
- Migrácia: `profiles` tabuľka s `id` (FK na `auth.users`), `display_name`, `avatar_url`, `created_at`, `updated_at`
- RLS: user vidí/upravuje len svoj profil
- Trigger: auto-create profil pri signup z `raw_user_meta_data`

### Súbory

**Nové:**
- `src/pages/AuthPage.tsx`
- `src/hooks/use-auth.ts`
- `src/components/auth/AuthProvider.tsx`
- `src/components/auth/UserMenu.tsx`
- (auto) `src/integrations/lovable/index.ts`

**Upravené:**
- `src/App.tsx` — `/auth` route + `<AuthProvider>` wrap
- `src/components/landing/WireNav.tsx` — Login link + UserMenu
- (možno) migrácia pre `profiles` tabuľku

### Vizuál
Žiadne nové farby/fonty. Len existujúce wireframe utility. Tlačidlá majú `wire-shadow-sm`, hover micro-shift, mono labely. Apple tlačidlo čierne (foreground bg), Google biele (border), email accent primary.

### Otázky k vyjasneniu

Hneď ti pošlem 3 kartičky — bez tvojich odpovedí by som hádal:
1. Či vôbec robiť Microsoft/GitHub (vyžaduje rozpojenie Cloud)
2. Či potrebuješ user profily (display name, avatar) alebo stačí `auth.users`
3. Či pridať aj email + heslo formulár, alebo len social

