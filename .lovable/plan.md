

## Cieľ
Vygenerovať samostatnú verziu loga — **iba shield bez textu "NEXIFY GUARD"** a **bez pozadia** (transparent PNG) — a použiť ju ako favicon a malé ikony.

## Plán

### 1. Vygenerovať shield-only ikonu
Použiť AI image generation (`google/gemini-3-pro-image-preview` pre najvyššiu kvalitu) s promptom:
- Iba shield element z existujúceho NEXIFY GUARD loga
- **Transparentné pozadie** (PNG s alpha kanálom)
- Štvorcový formát (1:1) vhodný pre favicon
- Ostré hrany, vysoký kontrast pre čitateľnosť aj v malých veľkostiach (16x16, 32x32)
- Štýl konzistentný s hlavným logom (rovnaká farebnosť shieldu)

Výstup uložiť ako `src/assets/nexify-shield.png`.

### 2. Aktualizovať favicon
- Skopírovať shield ikonu do `public/favicon.png` (prepíše existujúcu)
- `index.html` už referencuje `/favicon.png`, takže netreba meniť HTML

### 3. Overiť QA
- Otvoriť vygenerovaný PNG a skontrolovať:
  - Pozadie je naozaj transparentné (nie biele/sivé)
  - Shield je centrovaný, nie je orezaný
  - Detail je čitateľný aj pri zmenšení na 32px

### 4. Čo NEMENÍME
- Hlavné logo v `WireNav`, `WireFooter`, `AuthPage`, `Dashboard` — tam ostáva plné logo s textom
- Žiadne ďalšie komponenty (zatiaľ nie je miesto kde sa shield-only verzia používa okrem favicon)

## Súbory
1. `src/assets/nexify-shield.png` (nový — vygenerovaný)
2. `public/favicon.png` (prepísaný)

