

User chce prerobiť `GuardStatusBar` z jednoduchého status pásika na **plnohodnotnú "cyber attack map" sekciu** s live counter, animovanými číslami, log streamom a vizuálnou mapou útokov. Stále v wireframe estetike (biele BG, mono, dashed borders, blue akcent).

## Plán: Cyber Attack Map nad footerom

Premenujem `GuardStatusBar.tsx` na **`AttackMap.tsx`** (nový komponent, väčšia plocha) a starý status bar nechám ako tenký pásik priamo nad footerom.

### Layout — 2 vrstvy

**Vrstva 1: `AttackMap.tsx`** — veľká sekcia (cca 500px výška)  
Marker: `// LIVE · 09 · CYBER OPERATIONS CENTER`  
Nadpis: "Live mapa útokov · práve teraz"

3-stĺpcový grid (12-col):
- **Ľavý panel (3 cols)** — Counter stack:
  - Veľký animovaný counter "ÚTOKOV ZABLOKOVANÝCH DNES" — 5-miestne číslo, mono, ~6xl, tikajúce nahor
  - Pod tým 4 menšie countery: "Brute-force", "DDoS", "SQL inject", "Bot scrapery" — každý so svojou rastúcou hodnotou
  - Sparkline mini-graf "posledných 60 minút"
  
- **Stredný panel (5 cols)** — ASCII/SVG world map:
  - Wireframe outline svetadielov (jednoduchý SVG path, nie real mapa)
  - Animované "ping" bodky na náhodných koordinátoch (Brazília, Rusko, Čína, Nigéria, USA, Vietnam) — pulse animácia v primary blue
  - Každé X sekúnd nový ping s textom typu `[ATTACK] 185.220.x.x → BLOCKED`
  - Legend dole: typy útokov + ich farby (všetky v blue škále)

- **Pravý panel (4 cols)** — Live log stream:
  - Mono terminál vibe — tmavší soft bg
  - Auto-scrolling list ~10 riadkov, nové sa pridávajú zhora
  - Format: `[14:23:07] BLOCK · 91.92.x.x · brute-force · /wp-admin`
  - Status farby: BLOCK (blue), ALERT (orange-handwritten), OK (muted)
  - Header: `tail -f /var/log/nexify-guard.log` + blinking cursor

**Vrstva 2: `GuardStatusBar.tsx`** — zostane ako tenký pásik (existujúci) hneď pod AttackMap, doplním tam aj malý "active threats: N" counter.

### Animácia counterov
- Custom `useCounter` hook v `src/hooks/use-counter.ts`:
  - Štartuje z deterministickej hodnoty na základe času od polnoci (aby každý reload nezačal od 0)
  - Inkrement každých 800-3000ms o 1-7 (random jitter)
  - Smooth count-up cez `requestAnimationFrame` (200ms tween na každý nový target)
- Sub-countery sú deriváty hlavného (cca 45% / 25% / 18% / 12% split)

### Live log generator
- `src/lib/attack-log.ts`:
  - Pole IP prefixov, attack typov, target paths, krajín
  - Funkcia `generateLogEntry()` → vracia `{ timestamp, ip, country, type, target, action }`
  - V komponente `setInterval(800-2500ms)` pridá nový log, drží max 12 v stave
- Použijem `flushSync` ne, len obyčajný state — nemusí byť blazing fast

### Mapa — implementácia
- Inline SVG s wireframe outline kontinentov (zjednodušená geometria, ~6-8 path-ov)
- Ping bodky: pole fixných lat/lon → SVG x/y koordinátov
- Každý ping má entry animáciu (scale-in + fade) a po 4s sa resetuje
- Nový ping každé 1.5-3s, max 5 aktívnych naraz
- Pri každom ping-u tiež bliká ASCII text `>>> [event] <<<` v rohu mapy

### Vizuálne detaily (v štýle landing page)
- Container: `wire-border bg-background` s `wire-shadow`
- Mono labely všade `font-mono text-[10px] tracking-[0.2em] uppercase`
- Hlavný counter: žltý `wire-handwritten` accent stamp "↑ live" v pravom hornom rohu
- Decoratívne: `FIG_09 · live-feed.svg` stamp v rohu (ako u Hero obrázkov)
- Žiadne nové farby — len existujúce `--primary`, `--wire-*`, `--muted-foreground`

### Nový/upravený obsah

**Nové súbory:**
- `src/components/landing/AttackMap.tsx` — hlavná sekcia
- `src/components/landing/AttackMap/WorldMap.tsx` — SVG mapa s pingmi
- `src/components/landing/AttackMap/LiveLog.tsx` — log stream panel
- `src/components/landing/AttackMap/CounterStack.tsx` — countery panel
- `src/hooks/use-counter.ts` — animated count-up hook
- `src/lib/attack-log.ts` — log generator + konštanty (IP, krajiny, typy)

**Upravené súbory:**
- `src/pages/Index.tsx` — vložiť `<AttackMap />` medzi `<FAQ />` a `<GuardStatusBar />`
- `src/components/landing/GuardStatusBar.tsx` — pridať mini "active threats: N" counter (aby súvisel s AttackMap)

### Performance & cleanup
- Všetky `setInterval` v `useEffect` s cleanup
- `requestAnimationFrame` v counter hooku tiež cleanup
- Nepoužívam externé knižnice — všetko inline SVG + state

### Tone copy (slovenčina, po lopate)
- "Útokov zablokovaných dnes" (nie "blocked attacks today")
- "Práve teraz" / "Posledných 60 minút"
- Log akcie v EN (autenticky terminál vibe): `BLOCK`, `ALERT`, `MITIGATE`, `ALLOW`
- Krajiny v SK: "Rusko", "Čína", "Nigéria", "USA", "Brazília", "Vietnam", "Irán"

### Mobil
- Na <md: stack 1 stĺpec (countery → mapa → log)
- Mapa drží svoj aspect ratio, log stream skrátim na 6 riadkov

