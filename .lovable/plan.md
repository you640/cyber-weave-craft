
Cieľ: pridať druhý admin-only panel s live terminálom popri existujúcom `/dashboard/shell`, ale bez priameho WebSocket pripojenia zo browsera a bez vystavenia secretov klientovi.

1. Zachovať existujúci shell ako safe mode
- Nechať `/dashboard/shell` bez zmien ako auditovaný allowlist terminál cez `vps-exec`.
- Nový panel pridať samostatne, napr. `/dashboard/shell-live`, aby bolo jasné rozdelenie:
  - Shell = bezpečný / auditovaný režim
  - Shell Live = interaktívny live režim

2. Nepoužiť dodaný kód priamo
- Návrh `TerminalPage` v aktuálnej podobe nenasadiť:
  - je JSX-nekompletný,
  - pripája sa priamo na `wss://shell.nexify-studio.tech`,
  - nerieši bezpečný auth model,
  - obchádza existujúci admin/auth/audit model,
  - obsahuje klientský pattern, ktorý by mohol tlačiť citlivé údaje mimo backend guardu.

3. Pridať nový live panel do dashboardu
- Vytvoriť nový komponent panelu v dashboard štýle projektu.
- Pridať route do `src/pages/Dashboard.tsx`.
- Pridať položku do `AdminSidebar`.
- Panel bude mať:
  - stav spojenia,
  - scrollovateľný live output,
  - command input,
  - reconnect / disconnect akcie,
  - jasné označenie, že ide o live režim.

4. Navrhnúť server-side proxy vrstvu
- Browser sa nebude pripájať priamo na VPS relay.
- Namiesto toho vytvoriť backend funkciu/proxy, ktorá:
  - overí session,
  - overí admin rolu,
  - použije runtime secrets iba na serveri,
  - sprostredkuje komunikáciu k relay endpointu.
- Ak backend runtime nepodporí plnohodnotný WS bridge ergonomicky, fallback bude streaming HTTP/SSE proxy, ale stále ako samostatný live panel.

5. Zjednotiť bezpečnosť s existujúcim backend modelom
- Zachovať admin-only prístup rovnako ako v `vps-exec`, `vps-diagnose`, `mcp-call`.
- Neposielať `VPS_BASIC_USER`, `VPS_BASIC_PASS`, `VPS_SHARED_SECRET` do klienta.
- Použiť existujúce secrets len na backend strane.
- V UI zobraziť zrozumiteľné chybové stavy:
  - unauthorized,
  - forbidden,
  - relay not configured,
  - upstream unreachable,
  - connection closed.

6. Rozhodnúť sa pre audit správanie live panelu
- Keďže live režim obchádza súčasný allowlist model, pri implementácii zachytiť aspoň:
  - session start/end,
  - odoslané príkazy,
  - exit/error summary.
- Tým sa live panel odlíši od safe shellu, ale nestratí sa minimálna audit stopa.

7. Upratať UX a texty
- Jasne popísať rozdiel medzi panelmi v UI.
- Pri live paneli pridať warning, že ide o power-user režim.
- Zachovať vizuálny štýl dashboardu: wire-border, mono text, status labely, terminal layout.

8. Overenie po implementácii
- Otestovať admin route a sidebar navigáciu.
- Otestovať pripojenie live panelu s korektne nastavenými secrets.
- Otestovať chyby pri nedostupnom relay, zlom auth, a prerušení spojenia.
- Porovnať, že pôvodný `/dashboard/shell` ostal funkčný.
- Spraviť end-to-end test oboch režimov v preview.

Technické detaily
- Dotknuté súbory:
  - `src/pages/Dashboard.tsx`
  - `src/components/dashboard/AdminSidebar.tsx`
  - nový panel komponent pre live shell
  - pravdepodobne nová backend funkcia pre proxy režim
- Bezpečnostná zásada:
  - žiadne basic auth credentials v browser bundle,
  - žiadne priame `new WebSocket("wss://...")` z klienta so secret-based prístupom,
  - admin check musí zostať server-side.
- Existujúce secrets už sú dostupné, takže netreba pýtať nové, iba ich použiť bezpečne.
- Dodaný `TerminalPage` poslúži len ako UX inšpirácia, nie ako copy-paste implementácia.

Výsledok
- V dashboarde budú dva terminály:
  - bezpečný auditovaný shell,
  - samostatný live shell cez server-side proxy.
- Tým sa splní tvoj zámer “Pridať live panel” bez rozbitia aktuálnej bezpečnej architektúry.
