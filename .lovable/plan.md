
User žiada diagnostiku prečo `https://exec.nexify-studio.tech/exec` nefunguje. Toto je read-only research task — nepotrebujem meniť kód, len spustiť diagnostiku a interpretovať výsledky.

Mám k dispozícii:
- `vps-diagnose` edge funkciu, ktorá robí presne toto (health check + 3 varianty POST /exec)
- `supabase--curl_edge_functions` na zavolanie diagnostiky
- `supabase--edge_function_logs` na čítanie logov
- DNS check cez `code--exec` (dig)

## Plán

**Krok 1 — Spusti vps-diagnose**
Zavolám `/vps-diagnose` cez `supabase--curl_edge_functions` (POST). Vráti:
- Stav všetkých 4 secrets
- GET /health výsledok
- POST /exec (Bearer only)
- POST /exec (Basic only)
- POST /exec (Basic + Bearer cez X-Bridge-Auth)
- Odporúčanie ktorá auth schéma funguje

**Krok 2 — DNS + TCP overenie**
- `dig exec.nexify-studio.tech +short` (potvrdiť 194.182.87.6)
- `curl -I https://exec.nexify-studio.tech/health` (TLS + Caddy reachability zvonka)

**Krok 3 — Edge function logy**
Načítam posledné `vps-exec` a `vps-diagnose` logy pre kontext nedávnych zlyhaní.

**Krok 4 — Interpretácia**
Na základe výsledkov vyhodnotím jeden zo scenárov:

| Symptom | Príčina | Riešenie na strane VPS |
|---|---|---|
| GET /health timeout/refused | Caddy nebeží alebo firewall | `systemctl status caddy`, `ufw allow 443` |
| GET /health 502 | Caddy beží, ale `reverse_proxy` nedosiahne bridge | **Docker→host networking problém** — bridge počúva na `127.0.0.1:PORT` a Caddy v kontajneri nevidí hosta |
| GET /health 200, POST /exec 401 (všetky varianty) | Nesprávny `VPS_SHARED_SECRET` alebo Basic creds | Sync hodnôt s VPS |
| GET /health 200, "Bearer only" 401 ale "Basic+Bearer cez X-Bridge-Auth" 200 | Caddy nestripuje Authorization | OK — `vps-exec` už túto schému používa keď sú Basic creds nastavené |
| TLS error | SSL cert na Caddy expired/zlý | `caddy reload`, skontroluj cert |

User sám hint-uje: "Caddy v Dockeri sa nevie dovolať na bridge na hostiteľovi" → najpravdepodobnejšie scenár #2 (502 z `reverse_proxy`). Ak sa to potvrdí, riešenie je:
- V `docker-compose.yml` pre Caddy pridať `extra_hosts: ["host.docker.internal:host-gateway"]`
- V Caddyfile zmeniť `reverse_proxy 127.0.0.1:PORT` → `reverse_proxy host.docker.internal:PORT`
- ALEBO spustiť Caddy s `network_mode: host`
- ALEBO presunúť bridge do toho istého Docker networku ako Caddy

**Výstup pre usera**
Concise report v štýle:
```
DNS: ✓ 194.182.87.6
TLS: ✓/✗
GET /health: <status>
POST /exec (Bearer): <status>
POST /exec (Basic+Bearer): <status>

DIAGNÓZA: <root cause>
FIX: <konkrétne príkazy na VPS>
```

Žiadne zmeny v kóde — všetko sa rieši na VPS strane (Caddyfile / docker-compose). Po fixe user spustí HANDSHAKE v `/dashboard/diagnostics` na overenie.
