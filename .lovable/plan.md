

## Cieľ
Nahradiť aktuálne logo (`nexify-logo.png`) novým logom NEXIFY GUARD (shield + text) všade, kde sa používa.

## Analýza nového loga
Nové logo už obsahuje text "NEXIFY GUARD" priamo v obrázku (shield + wordmark). To znamená, že na miestach, kde teraz vedľa loga píšeme "NEXIFY *studio*" textom, by sme mali tento text **odstrániť** — inak vznikne duplicita ("NEXIFY GUARD NEXIFY studio").

## Plán

### 1. Skopírovať nový logo súbor
- `lov-copy user-uploads://logooo.png src/assets/nexify-logo.png` — prepíše existujúci asset, takže všetky komponenty čo ho importujú dostanú nové logo automaticky
- `lov-copy user-uploads://logooo.png public/favicon.png` — aktualizuje aj favicon

### 2. Upraviť komponenty kde je logo + text "NEXIFY studio"
Pretože nové logo už má integrovaný wordmark, odstránime sprievodný textový span a zväčšíme logo aby bolo čitateľné:

- **`src/components/landing/WireNav.tsx`** — odstrániť `<span>NEXIFY studio</span>`, zväčšiť logo z `w-10 h-10` na napr. `h-9 w-auto` (zachovať pomer strán shieldu + textu)
- **`src/components/landing/WireFooter.tsx`** — to isté, odstrániť sprievodný text, zväčšiť logo na `h-12 w-auto`
- Upraviť `alt` text na `"Nexify Guard logo"`

### 3. Pridať logo aj na ďalšie miesta
- **`src/pages/AuthPage.tsx`** — momentálne nemá logo v hero/auth karte; pridať logo nad nadpis "Vstup do dispečingu" (malé, centrované, napr. `h-10 w-auto`)
- **`src/pages/Dashboard.tsx`** — v headeri pridať logo vedľa "← exit" linku (malé, `h-7 w-auto`)

### 4. Skontrolovať ostatné miesta
- `src/assets/gruppa-logo.svg` — nepoužívaný legacy súbor, neriešiť
- Index.html OG image — externý URL, neriešiť (nesúvisí s týmto)

## Súbory na úpravu
1. `src/assets/nexify-logo.png` (prepis cez lov-copy)
2. `public/favicon.png` (prepis cez lov-copy)
3. `src/components/landing/WireNav.tsx` (odstránenie textu, zväčšenie loga)
4. `src/components/landing/WireFooter.tsx` (odstránenie textu, zväčšenie loga)
5. `src/pages/AuthPage.tsx` (pridanie loga nad H1)
6. `src/pages/Dashboard.tsx` (pridanie loga do headeru)

## Čo NEMENÍME
- Routing, edge functions, štýly, copy
- OG/social share image (externý URL)
- Tailwind config, fonty

