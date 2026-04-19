

User wants me to create standalone pages/sections for footer links that currently point to `#` (dead links). Need to decide: separate routes vs in-page sections.

Looking at footer in `WireFooter.tsx`:
- **Služby**: Audit logov, WP hardening, Pentest, WAF setup → these are already in `Services.tsx` table on landing
- **Spoločnosť**: O nás, Case studies, Blog, Kontakt → mostly missing
- **Legal**: Privacy, DPA, Terms, Cookies → missing

Best approach: separate routes (real pages) for legal + company pages. Služby links → anchor scroll to existing Services section + service detail modals would be overkill, just deep-link to `/sluzby/audit-logov` style or anchor. Simplest: anchor to `#služby` for Služby column (already exists), real routes for the rest.

## Plán: Doplniť plnohodnotné stránky pre footer odkazy

Vytvorím **8 nových stránok** ako samostatné routes + zachovám wireframe estetiku (biele BG, mono fonty, dashed borders, blue akcent). Každá stránka bude mať `WireNav` hore, `WireFooter` dole a obsah zarovnaný do `max-w-7xl` containeru.

### Nové routes v `App.tsx`

```
/o-nas              → AboutPage.tsx
/case-studies       → CaseStudiesPage.tsx
/blog               → BlogPage.tsx
/kontakt            → ContactPage.tsx
/privacy            → PrivacyPage.tsx
/dpa                → DpaPage.tsx
/terms              → TermsPage.tsx
/cookies            → CookiesPage.tsx
```

### Footer Služby stĺpec → anchor scroll
Linky `Audit logov`, `WP hardening`, `Pentest`, `WAF setup` upravím tak, aby skrolovali na `#služby` sekciu na landingu (existuje v `Services.tsx`). Nepotrebujú samostatné stránky — už majú detail v Services tabuľke.

### Obsah stránok (každá ~ wireframe layout s `SectionMarker`)

**1. `/o-nas` — O nás**
- Marker `// COMPANY · 01`
- H1: "Nezávislý cybersec butik z Bratislavy"
- 3-stĺpcový text: príbeh, misia, prístup
- Tím sekcia: 3 placeholder karty (founder, security engineer, devops)
- Stat row: roky skúseností, počet auditov, klientov

**2. `/case-studies` — Case studies**
- Marker `// PROOF · 02`
- 6 wireframe kariet: anonymizované klienty (eshop kozmetika, B2B SaaS, booking, médiá, fintech, healthcare)
- Každá karta: industry tag, problém, riešenie, metric (např. "−97% brute-force pokusov za 30d")
- Filter chips hore: `[všetky] [eshop] [SaaS] [korporát]`

**3. `/blog` — Blog**
- Marker `// JOURNAL · 03`
- 6 placeholder článkov v 2-stĺpcovom layoute
- Každý: dátum, kategória tag, H3 titulok, lead paragraf, "čítať →"
- Témy: WordPress CVE, NIS2 prehľad, post-mortem incidentu, GDPR FAQ, Cloudflare WAF, RLS Supabase
- Sidebar: kategórie, tag cloud (mono štýl)

**4. `/kontakt` — Kontakt**
- Marker `// CONTACT · 04`
- 2-stĺpcový layout: ľavá info (email, telefón 24/7 incident line, adresa, IČO/DIČ), pravá wireframe form (meno, email, typ požiadavky select, správa, submit)
- Pásik: "🚨 Incident? Volajte priamo: +421 XXX XXX XXX (24/7)"
- Form je vizuálny mock, submit zobrazí `toast` "Ďakujeme, ozveme sa do 24h"

**5. `/privacy` — Privacy Policy**
- Marker `// LEGAL · PRIVACY`
- Plnohodnotný GDPR-compliant text v slovenčine: prevádzkovateľ, účely spracovania, právne základy, doby uchovávania, práva dotknutých osôb, kontakt na DPO
- Štruktúrované do nadpisov H2/H3 s číslovanými sekciami (1., 1.1, 1.2…)
- Posledná aktualizácia: "platné od 19. 4. 2026"

**6. `/dpa` — Data Processing Agreement**
- Marker `// LEGAL · DPA`
- Šablóna zmluvy o spracovaní osobných údajov medzi prevádzkovateľom (klient) a sprostredkovateľom (Nexify)
- Sekcie: predmet, povinnosti sprostredkovateľa, sub-processors zoznam, technické a organizačné opatrenia, audit rights, ukončenie
- Download CTA mock: `[ Stiahnuť PDF verziu → ]`

**7. `/terms` — Terms of Service**
- Marker `// LEGAL · TERMS`
- Obchodné podmienky: definície, predmet služby, povinnosti zmluvných strán, cena a platba, SLA (incident response časy), zodpovednosť za škodu, ukončenie, rozhodné právo SK
- 12+ číslovaných sekcií

**8. `/cookies` — Cookie Policy**
- Marker `// LEGAL · COOKIES`
- Zoznam cookies v wireframe tabuľke: názov, účel, doba platnosti, typ (nutné/analytické/marketing)
- Vysvetlenie ako spravovať cookies v prehliadači
- Tlačidlo `[ Spravovať preferencie ]` (mock)

### Spoločné komponenty

**Nový `PageShell.tsx`** — wrapper pre všetky podstránky:
```tsx
<div className="min-h-screen bg-background wire-dots">
  <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-16">
    <WireNav />
    <main className="mt-12">{children}</main>
    <WireFooter />
  </div>
</div>
```

**`LegalPageLayout.tsx`** — pre 4 legal stránky (zdieľaný štýl s side TOC vľavo, content vpravo).

### Úpravy existujúcich súborov

**`App.tsx`** — pridať 8 nových routes pred `*` catch-all.

**`WireFooter.tsx`** — nahradiť `href="#"` reálnymi `<Link to="/...">` z react-router-dom. Služby column → `<a href="/#služby">` (anchor na landing).

**`WireNav.tsx`** — logo a "Login" button budú `Link` na `/`. Pridať: keď nie sme na `/`, namiesto anchor menu zobraziť "← Späť na hlavnú".

### Tone & jazyk
Všetko v slovenčine, profesionálny ale prístupný tón. Legal stránky formálnejšie, blog/case studies ľudsky, kontakt akčne.

### Vizuálny štýl
1:1 zachovaný — `wire-border`, `wire-shadow`, `SectionMarker`, dashed borders, `font-mono` labely, blue akcent. Žiadne nové farby ani fonty.

### Nové súbory
- `src/components/layout/PageShell.tsx`
- `src/components/layout/LegalPageLayout.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/CaseStudiesPage.tsx`
- `src/pages/BlogPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/PrivacyPage.tsx`
- `src/pages/DpaPage.tsx`
- `src/pages/TermsPage.tsx`
- `src/pages/CookiesPage.tsx`

### Upravené súbory
- `src/App.tsx` — routes
- `src/components/landing/WireFooter.tsx` — Link namiesto href="#"
- `src/components/landing/WireNav.tsx` — Link na logo, conditional menu

