
User dal výstup z agenta — ale je to len **plán/template**, NIE reálny výstup z VPS. Agent nevykonal žiadne príkazy, len opísal čo by spravil.

Potrebujem mu povedať že tento výstup je nepoužiteľný a dať mu konkrétny next step.

## Plán

Krátka odpoveď v chate (žiadne zmeny v kóde):

1. **Konštatovať**: agent vrátil len plán, nie výsledky — chýbajú všetky `[✓/✗]` hodnoty, surové výstupy, root cause.
2. **Dať 3 možnosti** ako pokračovať:
   - **A)** Pošli agentovi follow-up: "Teraz ten plán SPUSTI a vráť vyplnený template zo sekcie H."
   - **B)** Daj mi SSH prístup (alebo spusti tieto príkazy sám) a ja interpretujem výstup.
   - **C)** Keďže `vps-diagnose` edge funkcia už existuje, spusti ju z `/dashboard/diagnostics` — vráti reálne HTTP statusy z bridge endpointu (čo je presne to čo potrebujeme z vonku).
3. **Odporúčanie**: začať s **C** (1 klik, žiadny SSH) — ak ukáže 200 OK, hotovo. Ak fail, vieme presne ktorý layer (DNS/TLS/auth/bridge) a vtedy ide A alebo B.

Žiadne zmeny v kóde, žiadne nové súbory. Iba textová odpoveď + odporúčané akcie.
