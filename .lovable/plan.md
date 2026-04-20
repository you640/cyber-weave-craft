

## Cieľ
Veľký refactor **header menu (WireNav)** a **hero sekcie (Hero)** — kvalitnejší vizuál, lepšia hierarchia, mobilná navigácia, výraznejšie CTA, "živý" trust layer.

---

## 1. WireNav — premium navigácia

**Štruktúra (3 sloty: ľavý / stredný / pravý):**
- **Ľavý:** logo (shield mobile, full desktop) + jemný "live status" pill `● ONLINE · sentinel-01`
- **Stredný:** linky s aktívnym stavom (zvýraznenie aktuálnej kotvy cez IntersectionObserver)
- **Pravý:** UserMenu, sekundárne tlačidlo `Login`, primárne CTA `Audit →` so sand-glass ikonou + mobilný hamburger

**Vylepšenia:**
- **Scroll-aware:** v hornej polohe nav transparentný/jemný; pri scrolle pridá `backdrop-blur` + výraznejší border + zmenší padding (compact mode)
- **Active-link indikátor:** modrý `▍` ľavý okraj alebo podčiarknutie pri aktívnej sekcii
- **Hover micro-interactions:** šípka `→` sa vysunie pri hover na CTA, linky majú jemnú "monospace bracket" animáciu `[ link ]`
- **Mobile menu:** hamburger ikona otvorí `Sheet` (shadcn) zo strany — full-screen overlay s veľkými mono linkami, sociálnymi ikonami a CTA
- **Keyboard accessible:** focus-visible outlines, Esc zatvára sheet
- **"Command palette" hint:** malý `⌘K` chip vpravo (vizuálny prvok, neskôr funkčný)

---

## 2. Hero — refactor o 500 %

**Nová horná lišta (announcement bar):**
- Namiesto statického pillu → **rotujúci ticker** s 3 správami:
  `● LIVE · Blokovaných útokov dnes: 1 247` / `🛡 SOC online · reakcia < 4h` / `📍 SK · CZ · 2026`
- Výraznejšie typo, jemný gradient pozadia

**Headline & copy:**
- Zachovať existujúci headline, ale pridať **"typewriter" efekt** na slovo `bez stráže.` (alebo cyklus: bez stráže / bez logov / bez záchrannej siete)
- Pod headline pridať **"as seen in" / dôveryhodnostný riadok** — logá technologií ktoré monitorujeme (WordPress, Shopify, Cloudflare, AWS) ako sivé wireframe boxy
- Lepšia hierarchia: lead paragraph zväčšený, supporting paragraph menší, viac whitespace

**CTA blok:**
- Primárne CTA `Objednať audit zdarma →` zväčšené, s pulzujúcim ringom
- Sekundárne `Pozrieť demo (2 min)` s `▶` ikonou namiesto PDF cenníka
- Pod CTA: **trust microcopy** `✓ Bez kreditky · ✓ Audit do 24h · ✓ Žiadny záväzok`

**Stats grid (4 boxy):**
- Pridať **animované počítadlo** (count-up od 0 pri scroll-into-view)
- Pridať mini-sparkline alebo ikonu do každého boxu
- Hover stav: box sa mierne zdvihne (`translate -1px` + shadow)

**Pravý stĺpec (dashboard preview):**
- Hlavný obrázok dostane **"browser chrome" rámček** (3 bodky + URL bar `nexify.guard/dashboard`)
- Pridať **floating notification card** poprí rohu: `🚨 Brute-force blokovaný · pred 12s` (animovaný in)
- 3 thumbnaily dole — pridať hover zoom + label pri hover
- Annotation `live SIEM ↑` urobiť výraznejšiu

**Nový element pod hero:**
- **Marquee/ticker** so 6-8 logami klientov alebo technológií (nekonečný scroll), nadpis `Strážime stack ktorý poznáte`

---

## 3. Technická implementácia

**Nové súbory:**
- `src/components/landing/MobileNav.tsx` — Sheet-based mobilná navigácia
- `src/components/landing/AnnouncementTicker.tsx` — rotujúci horný banner
- `src/components/landing/BrowserFrame.tsx` — wrapper s URL barom okolo dashboard imagu
- `src/components/landing/TechMarquee.tsx` — nekonečný scrollovací riadok log
- `src/hooks/use-active-section.ts` — IntersectionObserver pre aktívne kotvy
- `src/hooks/use-scroll-position.ts` — pre scroll-aware nav
- `src/hooks/use-count-up.ts` — animované čísla v stats

**Upravené súbory:**
- `src/components/landing/WireNav.tsx` — kompletný refactor
- `src/components/landing/Hero.tsx` — kompletný refactor
- `src/index.css` — nové utility (`.nav-compact`, `.marquee`, animácie keyframes)

**Závislosti:** všetko už je (shadcn Sheet, lucide-react, react-router). Žiadne nové npm balíky.

---

## 4. Čo NEMENÍME
- Routing, Supabase, edge functions
- Logo assety (ostávajú nové)
- Dolnú časť landingu (Guard, Tiers, Services...)
- Color tokens / fonty
- Texty mimo hero sekcie

