import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

const PrivacyPage = () => (
  <LegalPageLayout
    metaTitle="Privacy Policy · Ochrana osobných údajov | Nexify"
    metaDescription="Ako spracúvame osobné údaje v súlade s GDPR. Účely, právne základy, doby uchovávania, vaše práva a kontakt na DPO."
    marker={{ num: "LEGAL · PRIVACY", label: "Ochrana osobných údajov" }}
    title="Ochrana osobných údajov"
    intro="Tento dokument vysvetľuje, aké osobné údaje spracúvame, prečo, ako dlho a aké máte práva. Postupujeme v súlade s nariadením GDPR a zákonom č. 18/2018 Z. z."
    updated="Platné od 19. 4. 2026 · v 1.0"
    sections={[
      {
        id: "prevadzkovatel",
        num: "1",
        title: "Prevádzkovateľ",
        body: (
          <>
            <p>
              <strong>Nexify Studio s. r. o.</strong>, Mlynské nivy 5, 821 09 Bratislava, Slovenská republika,
              IČO: 50 000 000, zapísaná v OR OS Bratislava I, oddiel Sro, vložka č. xxxxx/B.
            </p>
            <p>
              Kontakt vo veciach ochrany údajov: <strong>privacy@nexify-studio.tech</strong>
            </p>
          </>
        ),
      },
      {
        id: "ucely",
        num: "2",
        title: "Účely spracovania a právne základy",
        body: (
          <>
            <p>Vaše osobné údaje spracúvame výhradne pre tieto účely:</p>
            <ul>
              <li><strong>Plnenie zmluvy</strong> (čl. 6 ods. 1 písm. b GDPR) — dodanie služieb auditu, pentestu, retainera.</li>
              <li><strong>Zákonná povinnosť</strong> (čl. 6 ods. 1 písm. c GDPR) — vystavovanie faktúr, účtovníctvo, archivácia.</li>
              <li><strong>Oprávnený záujem</strong> (čl. 6 ods. 1 písm. f GDPR) — bezpečnostné monitorovanie nášho infraštruktúry, prevencia podvodov.</li>
              <li><strong>Súhlas</strong> (čl. 6 ods. 1 písm. a GDPR) — newsletter, marketing, nepovinné cookies.</li>
            </ul>
          </>
        ),
      },
      {
        id: "kategorie",
        num: "3",
        title: "Kategórie spracúvaných údajov",
        body: (
          <ul>
            <li>Identifikačné: meno, priezvisko, titul, funkcia.</li>
            <li>Kontaktné: email, telefón, adresa firmy.</li>
            <li>Fakturačné: IČO, DIČ, IČ DPH, bankové spojenie.</li>
            <li>Technické (pri auditoch): IP adresy, logy, konfigurácie systémov klienta — výhradne v rozsahu a po dobu nutnú na dodanie služby.</li>
            <li>Marketingové (pri súhlase): preferencie newslettera, otvorené emaily.</li>
          </ul>
        ),
      },
      {
        id: "doba",
        num: "4",
        title: "Doby uchovávania",
        body: (
          <ul>
            <li>Zmluvná dokumentácia: 10 rokov po ukončení zmluvy (zákonná lehota).</li>
            <li>Účtovné doklady: 10 rokov.</li>
            <li>Audit reporty a technické dáta klienta: max. 24 mesiacov po dodaní, alebo skôr na žiadosť klienta.</li>
            <li>Marketingové údaje: do odvolania súhlasu, max. 3 roky bez interakcie.</li>
            <li>Údaje z kontaktného formulára: 12 mesiacov.</li>
          </ul>
        ),
      },
      {
        id: "prijemcovia",
        num: "5",
        title: "Príjemcovia a sub-processors",
        body: (
          <>
            <p>Údaje neposkytujeme tretím stranám, okrem nasledujúcich preverených spracovateľov:</p>
            <ul>
              <li><strong>Cloudflare</strong> (US/EU) — CDN a WAF.</li>
              <li><strong>Supabase / AWS eu-central-1</strong> — hosting databázy a aplikácie.</li>
              <li><strong>Resend</strong> — transakčné emaily.</li>
              <li><strong>Účtovná kancelária</strong> (SK) — spracovanie účtovníctva.</li>
            </ul>
            <p>So všetkými máme uzavretú DPA. Aktuálny zoznam na vyžiadanie.</p>
          </>
        ),
      },
      {
        id: "externe-zdroje",
        num: "5a",
        title: "Externé zdroje vulnerability dát (NVD/NIST)",
        body: (
          <>
            <p>
              Spoločnosť využíva údaje z <strong>Národného registra zraniteľností (NVD)</strong>{" "}
              spravovaného <strong>NIST</strong> na obohatenie našich bezpečnostných analýz a
              hodnotení zraniteľností. Dáta z NVD slúžia ako autoritatívny zdroj informácií o
              CVE, CVSS, CWE a CPE a sú používané na automatizáciu správy zraniteľností,
              meranie bezpečnosti a súlad s normami.
            </p>
            <p>
              Doplnkovo používame verejné referenčné zdroje{" "}
              <strong>MITRE ATT&amp;CK</strong>, <strong>CISA KEV</strong> a{" "}
              <strong>EPSS (FIRST.org)</strong>. Ide výhradne o <strong>verejné referenčné
              dáta</strong> — pri dotazoch do týchto zdrojov{" "}
              <strong>neprenášame žiadne osobné údaje klientov</strong> ani citlivé technické
              dáta z prostredia klienta. Korelácia výsledkov prebieha lokálne v našej
              infraštruktúre (EÚ).
            </p>
          </>
        ),
      },
      {
        id: "prenosy",
        num: "6",
        title: "Prenosy mimo EÚ",
        body: (
          <p>
            K prenosu údajov mimo EHP dochádza výhradne v rámci Cloudflare (US) na základe Standard Contractual Clauses (SCC) podľa rozhodnutia Európskej komisie 2021/914.
          </p>
        ),
      },
      {
        id: "prava",
        num: "7",
        title: "Vaše práva",
        body: (
          <>
            <p>V súvislosti so spracovaním máte právo:</p>
            <ul>
              <li>na prístup k svojim údajom (čl. 15 GDPR),</li>
              <li>na opravu nepresných údajov (čl. 16 GDPR),</li>
              <li>na vymazanie („právo byť zabudnutý") (čl. 17 GDPR),</li>
              <li>na obmedzenie spracovania (čl. 18 GDPR),</li>
              <li>na prenosnosť údajov (čl. 20 GDPR),</li>
              <li>namietať voči spracovaniu (čl. 21 GDPR),</li>
              <li>kedykoľvek odvolať súhlas (bez vplyvu na zákonnosť predchádzajúceho spracovania),</li>
              <li>podať sťažnosť na <strong>Úrad na ochranu osobných údajov SR</strong>, Hraničná 12, 820 07 Bratislava, www.dataprotection.gov.sk.</li>
            </ul>
            <p>Žiadosti vybavujeme do 30 dní na adrese <strong>privacy@nexify-studio.tech</strong>.</p>
          </>
        ),
      },
      {
        id: "bezpecnost",
        num: "8",
        title: "Bezpečnostné opatrenia",
        body: (
          <p>
            Aplikujeme šifrovanie pri prenose (TLS 1.3) aj pri uložení (AES-256), MFA pre všetky prístupy, segregáciu dát klientov, role-based access control, log monitoring a pravidelné penetračné testy našej vlastnej infraštruktúry.
          </p>
        ),
      },
      {
        id: "zmeny",
        num: "9",
        title: "Zmeny politiky",
        body: (
          <p>
            Túto politiku môžeme aktualizovať. O podstatných zmenách informujeme emailom alebo zreteľným upozornením na webe minimálne 30 dní vopred.
          </p>
        ),
      },
    ]}
  />
);

export default PrivacyPage;
