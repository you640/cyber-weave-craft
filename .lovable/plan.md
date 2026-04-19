

User wants a WIREFRAME design — SaaS edition, white background. Not the dark cyberpunk version. Wireframe = raw, sketchy, low-fi mockup aesthetic with hand-drawn / blueprint feel, but SaaS-polished.

## Wireframe SaaS Landing Page – Cenník 2026

Prerobím `Index.tsx` na **wireframe-style landing page** s bielym pozadím a obsahom z cenníka kybernetickej bezpečnosti. Estetika: low-fidelity SaaS mockup ako z Figma / Balsamiq, ale s tasteful polish.

### Vizuálny jazyk (wireframe SaaS)
- **Pozadie**: čisté biele `#ffffff`, jemný dot grid alebo blueprint mriežka (`#f0f0f0`)
- **Farby**: čierna `#0a0a0a`, šedé tóny (`#666`, `#999`, `#e5e5e5`), jeden akcent **electric blue** `#2563eb` pre CTA a highlighty
- **Typografia**: 
  - **JetBrains Mono** pre labels, kódy, ceny (wireframe annotations)
  - **Inter** pre headlines a body
  - Handwritten accent (Caveat) pre wireframe poznámky typu "← najpopulárnejší"
- **Štýl prvkov**:
  - Dashed borders (`border-dashed`), 1px solid lines
  - Placeholder boxy s diagonálnym šrafovaním (`<div class="placeholder">`)
  - "Image goes here" boxy s X krížom (SVG)
  - Annotation šípky a poznámky na okrajoch
  - Wireframe komponenty: button placeholders, input mockups, fake nav

### Štruktúra sekcií
1. **Top nav wireframe** – logo placeholder `[LOGO]`, nav links, "Sign up" button mockup
2. **Hero** – veľký H1 "Kybernetická bezpečnosť bez kompromisov", lede, dva CTA buttony (primary blue + ghost), 4-stat grid v dashed boxoch, vpravo placeholder pre "product screenshot" so šrafou
3. **Annotation banner** – wireframe markup `// 01 · BALÍČKY` s handwritten šípkou
4. **Tiers** – 3 karty s dashed bordermi, "POPULAR" stamp na strednej, ceny v mono fonte, feature listy s `[ ]` checkbox placeholdermi
5. **Services grid** – 8 service kariet, každá s ID kódom (SVC_01…), placeholder ikonou (geometric SVG), deliverables list
6. **Add-ons table** – čistá wireframe tabuľka s tenkými linkami
7. **Retainers** – 3 paušály ako pricing kartičky
8. **FAQ** – accordion s `[+]` `[−]` mono indikátormi
9. **Footer** – wireframe baseline, signature `nexify-studio.tech`, version stamp

### Komponenty (`src/components/landing/`)
- `WireNav.tsx`
- `Hero.tsx` – vrátane `ScreenshotPlaceholder.tsx`
- `Tiers.tsx`
- `Services.tsx`
- `AddonsTable.tsx`
- `Retainers.tsx`
- `FAQ.tsx` (Radix Accordion)
- `WireFooter.tsx`
- `WireAnnotation.tsx` – reusable handwritten šípky / poznámky
- `PlaceholderBox.tsx` – šrafovaný placeholder so X

### Design system updates
- `index.css`: light theme tokens (background white, foreground near-black, accent blue, muted grey), dot-grid background utility, dashed border utility
- `tailwind.config.ts`: extend fontFamily (mono, sans,