
User chce diagnostický prompt — text, ktorý môže vložiť do iného AI agenta (alebo priamo SSH do VPS) aby overil že VPS má všetko správne nastavené pre Nexify bridge.

Mám všetok kontext:
- VPS IP: 194.182.87.6
- Doména: exec.nexify-studio.tech
- Bridge endpoint: `/exec` (POST), `/health` (GET)
- Auth: Bearer (`VPS_SHARED_SECRET`) + voliteľne Basic (admin / Poklop123#####)
- Caddy beží v Dockeri, bridge na hoste → potrebuje `host.docker.internal`
- Wrapper scripty: `nexify-health`, `nexify-wp-audit-start`, `nexify-wp-audit-status`, `nexify-list-reports`, `nexify-latest-report` v `/usr/local/bin/`
- TLS Alert 80 z minulej diagnostiky → SNI / cert problém

## Plán

Vytvorím **jeden self-contained diagnostický prompt** v slovenčine ktorý:

1. **Sekcia A — DNS + sieť** (z ľubovoľného stroja)
2. **Sekcia B — Caddy / TLS / Docker** (SSH na VPS)
3. **Sekcia C — Bridge service** (systemd + port + binding)
4. **Sekcia D — Caddyfile audit** (site block, reverse_proxy target, basicauth, header pass-through)
5. **Sekcia E — docker-compose audit** (extra_hosts, network_mode)
6. **Sekcia F — Wrapper scripty + sudoers**
7. **Sekcia G — End-to-end test** (curl Bearer, curl Basic+X-Bridge-Auth)
8. **Sekcia H — Output template** — formát ako má agent vrátiť výsledky

Každá sekcia obsahuje konkrétne shell príkazy + interpretačné pravidlá (čo znamená každý exit code / výstup).

Output bude jeden veľký copy-paste blok (markdown) ktorý user pošle do AI agenta s SSH prístupom na VPS, alebo si ho prejde sám.

Žiadne zmeny v kóde — výstup je text v chate.
