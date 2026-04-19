import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

const DpaPage = () => (
  <LegalPageLayout
    metaTitle="DPA · Zmluva o spracovaní osobných údajov | Nexify"
    metaDescription="Šablóna Data Processing Agreement medzi prevádzkovateľom a sprostredkovateľom podľa čl. 28 GDPR. Sub-processors, TOM, audit rights."
    marker={{ num: "LEGAL · DPA", label: "Data Processing Agreement" }}
    title="Zmluva o spracovaní osobných údajov"
    intro="Štandardná DPA podľa čl. 28 GDPR uzatváraná medzi klientom (prevádzkovateľ) a Nexify Studio (sprostredkovateľ) pri službách, kde spracúvame osobné údaje v mene klienta."
    updated="Verzia 2.1 · platná od 19. 4. 2026"
    sections={[
      {
        id: "predmet",
        num: "1",
        title: "Predmet a trvanie",
        body: (
          <>
            <p>
              Sprostredkovateľ spracúva osobné údaje výhradne v rozsahu a na účely uvedené v hlavnej zmluve o poskytovaní služieb.
            </p>
            <p>DPA platí po celú dobu trvania hlavnej zmluvy a 30 dní po jej ukončení (vrátenie / vymazanie dát).</p>
          </>
        ),
      },
      {
        id: "kategorie",
        num: "2",
        title: "Kategórie údajov a dotknutých osôb",
        body: (
          <ul>
            <li><strong>Kategórie údajov:</strong> identifikačné, kontaktné, technické (IP, logy), prípadne ďalšie podľa konkrétneho projektu.</li>
            <li><strong>Dotknuté osoby:</strong> zákazníci klienta, zamestnanci klienta, návštevníci webu klienta.</li>
          </ul>
        ),
      },
      {
        id: "povinnosti",
        num: "3",
        title: "Povinnosti sprostredkovateľa",
        body: (
          <ul>
            <li>Spracúvať údaje výhradne na základe písomných pokynov prevádzkovateľa.</li>
            <li>Zabezpečiť mlčanlivosť všetkých osôb s prístupom.</li>
            <li>Implementovať technické a organizačné opatrenia (TOM) podľa čl. 32 GDPR.</li>
            <li>Pomáhať prevádzkovateľovi pri vybavovaní žiadostí dotknutých osôb.</li>
            <li>Bezodkladne (do 24 h) oznámiť porušenie ochrany údajov.</li>
            <li>Po ukončení zmluvy údaje vrátiť alebo vymazať.</li>
          </ul>
        ),
      },
      {
        id: "subprocessors",
        num: "4",
        title: "Sub-processors",
        body: (
          <>
            <p>Sprostredkovateľ je oprávnený zapojiť ďalších spracovateľov za podmienky predchádzajúceho informovania prevádzkovateľa.</p>
            <p><strong>Aktuálny zoznam sub-processors:</strong></p>
            <ul>
              <li>Cloudflare, Inc. — CDN, WAF (US, SCC)</li>
              <li>Amazon Web Services EMEA SARL — hosting (Frankfurt, eu-central-1)</li>
              <li>Supabase, Inc. — managed database (eu-central-1)</li>
              <li>Resend, Inc. — transakčné emaily</li>
              <li>Sentry — error monitoring (EU region)</li>
            </ul>
            <p>Zmeny v zozname oznamujeme min. 30 dní vopred. Prevádzkovateľ má právo namietať.</p>
          </>
        ),
      },
      {
        id: "tom",
        num: "5",
        title: "Technické a organizačné opatrenia (TOM)",
        body: (
          <ul>
            <li><strong>Šifrovanie:</strong> TLS 1.3 pri prenose, AES-256 pri uložení.</li>
            <li><strong>Prístup:</strong> MFA povinné pre všetky účty, RBAC princíp najmenších oprávnení.</li>
            <li><strong>Logging:</strong> všetky prístupy k dátam klienta sú logované a uchovávané 12 mesiacov.</li>
            <li><strong>Segregácia:</strong> dáta každého klienta sú logicky oddelené.</li>
            <li><strong>Zálohovanie:</strong> denné zálohy s 30-dňovou retenciou, šifrované, geograficky oddelené.</li>
            <li><strong>Personál:</strong> NDA, security training 2× ročne, background check.</li>
            <li><strong>Incident response:</strong> 24/7 on-call, runbook, post-mortem do 5 pracovných dní.</li>
          </ul>
        ),
      },
      {
        id: "audit",
        num: "6",
        title: "Právo na audit",
        body: (
          <p>
            Prevádzkovateľ má právo raz ročne (alebo po incidente) vykonať audit dodržiavania DPA — buď na vlastné náklady, alebo akceptovať aktuálny SOC 2 / ISO 27001 report sprostredkovateľa, ak je k dispozícii.
          </p>
        ),
      },
      {
        id: "ukoncenie",
        num: "7",
        title: "Ukončenie a vrátenie údajov",
        body: (
          <p>
            Po ukončení zmluvy prevádzkovateľ rozhodne, či údaje vrátime (export v štandardnom formáte) alebo vymažeme. Vymazanie potvrdíme písomne do 30 dní. Zákonné kópie (účtovníctvo) zostávajú podľa zákona.
          </p>
        ),
      },
      {
        id: "zodpovednost",
        num: "8",
        title: "Zodpovednosť",
        body: (
          <p>
            Zmluvné strany zodpovedajú za škody spôsobené porušením GDPR podľa čl. 82 GDPR. Limit zodpovednosti sprostredkovateľa je dohodnutý v hlavnej zmluve.
          </p>
        ),
      },
      {
        id: "download",
        num: "9",
        title: "Stiahnuť podpísanú verziu",
        body: (
          <>
            <p>Pre podpísanie DPA pošlite email s názvom firmy a IČO na <strong>legal@nexify-studio.tech</strong>. Odpovedáme do 2 pracovných dní.</p>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-block mt-2 font-mono text-xs px-4 py-2.5 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all no-underline"
            >
              [ Stiahnuť PDF šablónu → ]
            </a>
          </>
        ),
      },
    ]}
  />
);

export default DpaPage;
