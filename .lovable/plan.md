

## Plán: exec-bridge na VPS 194.182.87.6

Toto nie je zmena v Lovable codebase — vygenerujem deployment balík (Go binary source + systemd unit + Caddy config + README) ako artefakty do `/mnt/documents/`, ktoré nahráš na VPS.

### Prečo Go (nie Node)
- Single static binary, žiadne `node_modules`, žiadne runtime deps na VPS
- ~8 MB binárka, štart < 50 ms, RAM < 20 MB
- Built-in `net/http` + `os/exec` — celý bridge má ~120 riadkov

### Architektúra

```text
Lovable edge fn (vps-exec)
        │  HTTPS POST {command}
        │  Authorization: Bearer <VPS_SHARED_SECRET>
        ▼
Caddy :443 (TLS via Let's Encrypt)
   exec.tapfast.<doména> ──► reverse_proxy localhost:8787
        ▼
exec-bridge (Go, systemd)
   - validuje Bearer token (constant-time compare)
   - spustí príkaz cez /bin/sh -c s 12s timeoutom
   - vráti {exit_code, stdout, stderr, duration_ms}
   - beží ako neprivilegovaný user `execbridge`
```

### Artefakty (do `/mnt/documents/exec-bridge/`)

1. **`main.go`** — HTTP server na `127.0.0.1:8787`
   - `POST /exec` — JSON `{command}` → spustí cez `exec.CommandContext` (12s timeout), vráti `{exit_code, stdout, stderr, duration_ms}` (stdout/stderr capnuté na 64 KB)
   - `GET /health` — `{ok: true}` bez auth
   - Bearer auth cez `subtle.ConstantTimeCompare`
   - Token z env `BRIDGE_SECRET`
   - Strukturované JSON logy do stdout (journald ich pochytí)

2. **`go.mod`** — žiadne externé deps (čistá std lib)

3. **`exec-bridge.service`** — systemd unit s hardeningom:
   ```
   User=execbridge, DynamicUser=no
   NoNewPrivileges=yes, ProtectSystem=strict, ProtectHome=yes
   PrivateTmp=yes, RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
   EnvironmentFile=/etc/exec-bridge/env  (obsahuje BRIDGE_SECRET=...)
   ```

4. **`Caddyfile.snippet`** — pridá sa do existujúceho `/etc/caddy/Caddyfile`:
   ```
   exec.tapfast.<tvoja-doména> {
       reverse_proxy 127.0.0.1:8787
       header {
           Strict-Transport-Security "max-age=31536000"
           X-Content-Type-Options nosniff
       }
   }
   ```
   Caddy automaticky vyrieši TLS cez Let's Encrypt.

5. **`install.sh`** — idempotentný setup script (spustíš ako root na VPS):
   - `useradd --system --no-create-home --shell /usr/sbin/nologin execbridge`
   - skompiluje binárku (`go build -ldflags="-s -w" -o /usr/local/bin/exec-bridge`)
   - vytvorí `/etc/exec-bridge/env` s vygenerovaným tokenom (`openssl rand -hex 32`) a chmod 600
   - nainštaluje systemd unit, `daemon-reload`, `enable --now`
   - vypíše token + Caddy snippet na konci

6. **`README.md`** — krok za krokom:
   - Predpoklady: Ubuntu 24, Go 1.22+ (`apt install golang-go`), Caddy už beží
   - DNS: A záznam `exec.tapfast.<doména>` → `194.182.87.6`
   - Spusti `sudo bash install.sh`
   - Skopíruj vygenerovaný token → vlož do Lovable secrets ako `VPS_SHARED_SECRET`
   - Nastav `VPS_BRIDGE_URL=https://exec.tapfast.<doména>/exec`
   - Pridaj snippet do `/etc/caddy/Caddyfile`, `sudo systemctl reload caddy`
   - Verifikácia: `curl https://exec.tapfast.<doména>/health`
   - Test: `curl -H "Authorization: Bearer <token>" -d '{"command":"uptime"}' https://exec.tapfast.<doména>/exec`

### Bezpečnosť
- Bridge **nemá whitelist** — tú si drží Lovable edge fn (vps-exec). Bridge je hlúpy executor.
- Constant-time bearer porovnanie (žiadne timing attacky)
- Beží pod neprivilegovaným userom — čo môže `execbridge`, môže príkaz
  - Pre prístup k `systemctl status` / `journalctl` netreba root (read-only)
  - Pre `docker ps` treba `usermod -aG docker execbridge` — README to zmieni
- Iba na `127.0.0.1` — z internetu nedostupný, len cez Caddy
- Caddy TLS + HSTS + bez expozície portu 8787

### Otvorená otázka
Aký doménový sub-záznam použijeme pre Caddy? Predpokladám že máš doménu pre `tapfast.tld` — ak nie, alternatíva je Caddy s self-signed cert + IP-only `https://194.182.87.6:8443` (Lovable edge fn s tým funguje). Ak chceš túto cestu, povedz a vygenerujem variant bez DNS.

