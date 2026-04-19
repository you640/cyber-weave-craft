import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

const TermsPage = () => (
  <LegalPageLayout
    metaTitle="Obchodné podmienky | Nexify"
    metaDescription="Všeobecné obchodné podmienky poskytovania cybersecurity služieb. SLA, platby, zodpovednosť, ukončenie."
    marker={{ num: "LEGAL · TERMS", label: "Obchodné podmienky" }}
    title="Všeobecné obchodné podmienky"
    intro={'Tieto VOP upravujú vzťah medzi Nexify Studio s. r. o. (ďalej „poskytovateľ") a klientom pri poskytovaní cybersecurity služieb.'}
    updated="Verzia 3.0 · platné od 19. 4. 2026"
    sections={[
      {
        id: "definicie",
        num: "1",
        title: "Definície",
        body: (
          <ul>
            <li><strong>Poskytovateľ:</strong> Nexify Studio s. r. o., IČO 50 000 000.</li>
            <li><strong>Klient:</strong> právnická alebo fyzická osoba podnikateľ objednávajúca služby.</li>
            <li><strong>Služba:</strong> audit, pentest, retainer, konzultácia alebo iný produkt definovaný v cenníku.</li>
            <li><strong>Incident:</strong> bezpečnostný alebo prevádzkový problém vyžadujúci reakciu poskytovateľa.</li>
            <li><strong>SLA:</strong> dohodnutá úroveň služieb (časy reakcie, dostupnosť).</li>
          </ul>
        ),
      },
      {
        id: "predmet",
        num: "2",
        title: "Predmet zmluvy",
        body: (
          <p>
            Poskytovateľ sa zaväzuje dodať klientovi služby v rozsahu a kvalite definovanej v objednávke / SOW (Statement of Work). Klient sa zaväzuje za služby zaplatiť dohodnutú odmenu.
          </p>
        ),
      },
      {
        id: "objednavka",
        num: "3",
        title: "Vznik zmluvy",
        body: (
          <p>
            Zmluva vzniká písomným potvrdením objednávky / SOW oboma stranami (vrátane elektronického podpisu alebo emailu z firemnej domény).
          </p>
        ),
      },
      {
        id: "povinnosti-poskytovatela",
        num: "4",
        title: "Povinnosti poskytovateľa",
        body: (
          <ul>
            <li>Dodať služby riadne, včas a v dohodnutej kvalite.</li>
            <li>Postupovať s odbornou starostlivosťou (industry best practices).</li>
            <li>Zachovávať mlčanlivosť o všetkých údajoch klienta.</li>
            <li>Bezodkladne informovať klienta o závažných nálezoch.</li>
          </ul>
        ),
      },
      {
        id: "povinnosti-klienta",
        num: "5",
        title: "Povinnosti klienta",
        body: (
          <ul>
            <li>Poskytnúť potrebné prístupy a dokumentáciu.</li>
            <li>Určiť kontaktnú osobu s rozhodovacou právomocou.</li>
            <li>Informovať o tretích stranách (hosting, ďalší dodávatelia), ktorých sa pentest týka.</li>
            <li>Akceptovať alebo namietať dodanie do 10 pracovných dní.</li>
            <li>Riadne a včas uhradiť faktúry.</li>
          </ul>
        ),
      },
      {
        id: "cena",
        num: "6",
        title: "Cena a platobné podmienky",
        body: (
          <ul>
            <li>Ceny sú uvedené v EUR bez DPH, ak nie je výslovne uvedené inak.</li>
            <li>Pri jednorazových projektoch: 50 % záloha, 50 % po dodaní.</li>
            <li>Pri retainery: mesačná fakturácia vopred, splatnosť 14 dní.</li>
            <li>Pri omeškaní: úrok 0,05 % z dlžnej sumy za každý deň + pozastavenie služieb po 30 dňoch.</li>
          </ul>
        ),
      },
      {
        id: "sla",
        num: "7",
        title: "SLA — úroveň služieb",
        body: (
          <ul>
            <li><strong>Strážny tier:</strong> reakcia &lt; 24 h, dostupnosť 99,5 %.</li>
            <li><strong>Ochranca tier:</strong> reakcia &lt; 4 h, dostupnosť 99,9 %.</li>
            <li><strong>Telochranca tier:</strong> reakcia &lt; 1 h, dostupnosť 99,95 %, dedicated engineer.</li>
            <li>Pri nedodržaní SLA: pomerná zľava z mesačného poplatku.</li>
          </ul>
        ),
      },
      {
        id: "zodpovednost",
        num: "8",
        title: "Zodpovednosť za škodu",
        body: (
          <>
            <p>Poskytovateľ zodpovedá za škodu spôsobenú porušením povinností do výšky odmeny zaplatenej klientom za posledných 12 mesiacov.</p>
            <p>Poskytovateľ nezodpovedá za:</p>
            <ul>
              <li>škody spôsobené tretími stranami (hosting, prevádzkovatelia, útočníci),</li>
              <li>nepriame škody, ušlý zisk, stratu dát, ak nešlo o hrubú nedbanlivosť,</li>
              <li>výpadky spôsobené zásahmi vyššej moci.</li>
            </ul>
          </>
        ),
      },
      {
        id: "duvernost",
        num: "9",
        title: "Dôvernosť",
        body: (
          <p>
            Obe strany sa zaväzujú zachovávať mlčanlivosť o dôverných informáciách počas trvania zmluvy a 5 rokov po jej ukončení. Porušenie zakladá nárok na zmluvnú pokutu vo výške 10 000 €.
          </p>
        ),
      },
      {
        id: "ukoncenie",
        num: "10",
        title: "Trvanie a ukončenie",
        body: (
          <ul>
            <li>Jednorazové projekty končia dodaním a akceptáciou.</li>
            <li>Retainery sa uzatvárajú na 12 mesiacov s automatickým predĺžením, výpovedná doba 60 dní.</li>
            <li>Okamžité ukončenie pri závažnom porušení druhou stranou.</li>
            <li>Pri ukončení: poskytovateľ vráti / vymaže dáta klienta do 30 dní.</li>
          </ul>
        ),
      },
      {
        id: "pravo",
        num: "11",
        title: "Rozhodné právo a riešenie sporov",
        body: (
          <p>
            Zmluva sa riadi právom Slovenskej republiky. Spory sa riešia primárne dohodou; pri neúspechu vecne príslušným súdom v sídle poskytovateľa.
          </p>
        ),
      },
      {
        id: "zaverecne",
        num: "12",
        title: "Záverečné ustanovenia",
        body: (
          <p>
            VOP môžu byť aktualizované. Zmena platí pre nové zmluvy odo dňa zverejnenia. Pre existujúcich klientov platí pôvodná verzia, ak nie je dohodnuté inak.
          </p>
        ),
      },
    ]}
  />
);

export default TermsPage;
