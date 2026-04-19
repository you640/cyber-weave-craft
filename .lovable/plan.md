

User chce pridať novú sekciu "Prečo práve my" na landing page, ktorá predstavuje **GRUPPA** ako partnera/dodávateľa enterprise-level developmentu. Logo je modré (#0087FF) — to sa krásne zhoduje s našou primary farbou.

## Plán: Sekcia "Partner · Enterprise development"

### Kam to umiestnim
Nová sekcia **medzi `<Stories />` a `<FAQ />`** v `src/pages/Index.tsx` — logicky tam, kde už hovoríme o trust signaloch (príbehy klientov → partner → časté otázky).

### Čo postavím

**Nový komponent `src/components/landing/Partner.tsx`** v 1:1 wireframe štýle:

- **Marker** `// PARTNER · 08 · ENTERPRISE STACK`
- **Nadpis**: "Prečo práve my"
- **Lead**: "Za našou bezpečnosťou stojí partner pre enterprise-level vývoj."

**Layout** (12-col grid):
- **Ľavá strana (5 cols)** — logo card:
  - `wire-border bg-background wire-shadow` panel
  - Nahor decorative stamp `FIG_08 · partner.svg`
  - Veľké GRUPPA logo (modré, na bielom pozadí, padding ~12)
  - Pod logom mono label: `// technologický partner`
  - Linka: `nexify-studio.tech ↔ gruppa.sk` (alebo skutočný link ak ho user pošle)

- **Pravá strana (7 cols)** — content:
  - H3: "Enterprise-level development"
  - Paragraf: "Dodávame technicky náročné enterprise riešenia s presnou architektúrou, dôrazom na škálovateľnosť, kvalitu a budúci rozvoj."
  - 3 mini-karty pod sebou (alebo grid 3) s pillarmi:
    - **Architektúra** — "Presná, dokumentovaná, pripravená na rast"
    - **Škálovateľnosť** — "Riešenia ktoré rastú s biznisom"
    - **Kvalita & rozvoj** — "Code review, testy, dlhodobá podpora"

**Asset handling:**
- Skopírujem `user-uploads://logo_gruppa_2025_b3.svg` → `src/assets/gruppa-logo.svg`
- Importujem ako ES6 modul v `Partner.tsx`

### Vizuálny štýl
1:1 zachovaný — `wire-border`, `wire-shadow`, `font-mono` labely, dashed dividery, blue (#0087FF už je naša `--primary`!), žiadne nové farby ani fonty.

### Súbory

**Nové:**
- `src/assets/gruppa-logo.svg` (kopírujem z uploadu)
- `src/components/landing/Partner.tsx`

**Upravené:**
- `src/pages/Index.tsx` — vložiť `<Partner />` medzi `<Stories />` a `<FAQ />`

### Otvorená otázka
Nemám URL na GRUPPA web — dám ako placeholder text bez linku, alebo ak chceš, pošli URL a urobím externý odkaz s `target="_blank"`.

