

## Cieľ
Prepísať landing page copy do nového hlasu — "Ezop pre CTO": pokojný, presný, dôveryhodný, obrazný, ale nie alarmistický. Zachovať wireframe estetiku, kódy sekcií (G_01, CASE_01, atď.) a celú štruktúru. Meníme **iba texty**, žiadne layout zmeny.

## Súbory na úpravu

1. **`src/components/landing/Hero.tsx`** — nový H1 "Váš web nemá zostať v noci bez stráže", subheadline o botoch, body copy, CTA, trust line, quick stats (Dohľad / Reakcia / Služba / Podpora s novými popismi).

2. **`src/components/landing/Guard.tsx`** — nadpis "Digitálna strážna služba pre biznis, ktorý nemá čas na paniku", nové intro o kamennom obchode, prepísané 4 piliere G_01–G_04 (Pozeráme sa stále / Alarmujeme hneď / Brzdíme útoky / Keď horí, hasíme), nový "Pre koho má zmysel mať stráž" blok + highlight line.

3. **`src/components/landing/ThreatBanner.tsx`** — nahradiť "Každých 39 sekúnd" za nový text "Každý deň niekto skúša, čo nechal internet otvorené. Otázka neznie, či sa niekto pozrie aj na váš web. Otázka znie, či tam v tej chvíli už niekto stojí." + CTA "Spustiť dohľad →".

4. **`src/components/landing/Tiers.tsx`** — nový nadpis "Tri úrovne ochrany. Bez hmly, bez kúziel, bez prekvapení na faktúre.", intro o pevnosti vs. zamknúť dvere, prepísané Strážny / Ochranca / Telochranca s pitch vetami.

5. **`src/components/landing/AddonsTable.tsx`** — nadpis "Samostatné moduly pre konkrétne problémy" + nové intro (zachovať zoznam modulov).

6. **`src/components/landing/WatchedThreats.tsx`** — nadpis "Nechytáme duchov. Chytáme konkrétne pokusy.", nové intro o hollywoodskom hackerovi, prepísané položky útokov (jemnejší, presnejší jazyk) a preventívnych problémov, jednorádok na konci.

7. **`src/components/landing/DataSources.tsx`** — nadpis "Neveštíme z kryštálu. Pracujeme s dátami.", nové intro, microcopy "Public reference data · bez prenosu klientskych PII".

8. **`src/components/landing/Retainers.tsx`** — nadpis "Audit je fotografia. Retainer je stráž, ktorá zostala v službe.", nové intro, prepísané Watch / Guard / Fortress popisy (zachovať ceny).

9. **`src/components/landing/Stories.tsx`** — nadpis "Príbehy, ktoré by vyzerali ako bájky, keby neboli v logoch", nové intro, prepísané CASE_01–03 (eshop kozmetika, B2B portál, rezervačný systém) s novým, pokojnejším jazykom a "Výsledok" riadkami.

10. **`src/components/landing/Partner.tsx`** — nadpis "Bezpečnosť stojí lepšie na silnej architektúre", nový body copy + highlight "Bezpečnosť × architektúra = systém, ktorý vydrží aj pod tlakom".

11. **`src/components/landing/FAQ.tsx`** — len intro nadpis "FAQ — priamo, vecne, bez omáčky" + nový intro text + CTA na e-mail (FAQ položky necháme tak, ako sú, ak nie sú v rozpore).

12. **`src/components/landing/AttackMap.tsx`** (a/alebo subkomponenty) — nadpis "Takto vyzerá noc na internete", nové intro a supporting copy o "otvorenom meste".

13. **`src/components/landing/GuardStatusBar.tsx`** — drobné textové úpravy (zachovať live počítadlo, len vyladiť labely podľa nového status bloku).

14. **`src/components/landing/WireFooter.tsx`** — nový tagline "Nezávislý cybersec butik pre slovenské a české firmy. Audit, pentest, hardening, monitoring a incident response pre tímy, ktoré radšej investujú do obrany než do neskorého ľutovania."

15. **`src/components/landing/WireNav.tsx`** — overiť eyebrow text "NEXIFY GUARD · 24/7 dohľad pre weby, eshopy a SaaS · SK / CZ · 2026" (ak je tam top bar).

## Čo NEMENÍME
- Layout, grid, wire-border štýly, farby, kódy sekcií (G_01, THR_01, CASE_01, SRC_01…).
- Routing, edge functions, dashboard, shell-live.
- Ceny v Retainers (249 / 690 / 1 890 €).
- Štruktúru komponentov a props.

## Poznámky k tónu
- Vyhadzujeme: "39 sekúnd", "hacknutý každých X", emoji-driven alarm jazyk, "ráno z reportu", "80 000 €" konkrétne čísla v príbehoch.
- Pridávame: pokojné metafory (kamenný obchod, otvorené mesto, fotografia vs. stráž), suchý humor ("daňový úrad", "technický folklór", "veľmi čudný vkus na URL parametre"), kratšie údery na konci sekcií.

## Implementačné kroky
1. Pre každý komponent prečítať aktuálny obsah a nahradiť iba textové reťazce v JSX (žiadne zmeny v štruktúre, importoch, props).
2. Pri zoznamoch (`attacks`, `prevention`, `targets`, `stories`) prepísať položky v dátových konštantách hore v súbore.
3. Pri Hero / Guard skontrolovať, že CTA odkazy (`#balíčky`, `#služby`) zostávajú funkčné.
4. Spustiť preview a vizuálne overiť, že nikde nepretieklo (najmä subheadline v Hero a pitch vety v Tiers — sú dlhšie než pôvodné).

