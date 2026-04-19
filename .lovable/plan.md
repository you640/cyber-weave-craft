

User wants 4 themed PNG images for the wireframe SaaS cybersecurity landing page. They should:
1. Fit the placeholders: `FIG_01 · dashboard.png`, `logs`, `alerts`, `report`
2. When combined in frames → form one big cohesive image
3. Each individually meaningful when opened alone

Style must match the wireframe aesthetic: white background, black lines, electric blue accent, dashed borders, mono labels, low-fi mockup feel.

## Plán: 4 wireframe-style PNG mockupy

Vygenerujem 4 PNG obrázky cez AI gateway (nano banana pro pre vysokú kvalitu), každý 1200×800px, ktoré:
- **Samostatne** dávajú zmysel (každý je plnohodnotný UI mockup)
- **Spolu** tvoria jeden vizuálny príbeh — security operations dashboard rozdelený do 4 panelov

### Vizuálny jazyk (zhodný s landing page)
- Biele pozadie `#ffffff`
- Čierne čiary, šedé tóny, electric blue `#2563eb` akcent
- JetBrains Mono labels, dashed/solid 1px borders
- Minimal wireframe SaaS estetika (Balsamiq/Figma low-fi)
- Žiadne fotorealistické prvky, iba UI mockup elementy

### 4 obrázky

**1. `dashboard.png`** — Hlavný overview panel
- Header s logom `[NEXIFY]`, tabs (Overview / Logs / Alerts)
- 4 stat karty: Threats Blocked, Uptime %, Active Scans, Risk Score
- Veľký line chart "Traffic vs Attacks (24h)" s blue líniou
- Side panel so zoznamom serverov so status dotmi

**2. `logs.png`** — Log forensics view
- Tabuľka access logov: timestamp, IP, method, path, status, threat tag
- Filter chips hore (`[7d] [30d] [BLOCKED] [SUSPICIOUS]`)
- Highlighted riadky s červeným threat indikátorom
- Sparkline graf vpravo (requests/min)

**3. `alerts.png`** — Alerts & incidents board
- Kanban-style 3 stĺpce: `NEW`, `INVESTIGATING`, `RESOLVED`
- Karty incidentov so severity badges (CRITICAL/HIGH/MED)
- CVE odkazy, timestamps, assigned engineer placeholders
- Top banner: "1 active incident · response SLA 2h 14m"

**4. `report.png`** — PDF audit report náhľad
- A4 dokument layout (page-like)
- Header: "SECURITY AUDIT REPORT · Q1 2026"
- Executive summary block, findings list s CVSS skóre
- Donut chart (severity breakdown), checklist remediation
- Page footer `// p.07 · nexify-studio.tech`

### Technický postup
1. Skopírujem AI gateway script do `/tmp/`
2. Pre každý obrázok zavolám `google/gemini-3-pro-image-preview` (nano banana pro) s detailným promptom popisujúcim wireframe estetiku + obsah panela
3. Uložím do `/mnt/documents/`:
   - `dashboard.png`
   - `logs.png`
   - `alerts.png`
   - `report.png`
4. QA: zobrazím každý obrázok cez `lov-view`, skontrolujem že:
   - Vyzerajú ako wireframe (nie fotorealistické)
   - Text je čitateľný a nepretieňa sa
   - Farby sedia (biele BG, blue akcent)
   - Spolu tvoria koherentný vizuálny set
5. Doručím cez `<lov-artifact>` tagy

Užívateľ ich potom môže stiahnuť a vložiť do landing page placeholdrov, prípadne v ďalšom kroku ich automaticky integrujem do `Hero.tsx` / `Services.tsx`.

