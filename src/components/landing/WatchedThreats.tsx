import { SectionMarker } from "./WireAnnotation";

const attacks = [
  "Niekto skúša uhádnuť heslo do administrácie (brute-force)",
  "Boti scrapujú vaše ceny pre konkurenciu",
  "Falošné objednávky z odcudzených kariet (carding)",
  "DDoS — niekto chce váš eshop „zhodiť“ v Čiernom piatku",
  "SQL injection — pokusy ukradnúť databázu zákazníkov",
  "Malware nahrávaný cez kontaktný formulár",
  "Pokusy o prevzatie účtov zákazníkov (credential stuffing)",
];

const prevention = [
  "Zastarané pluginy s bezpečnostnými dierami",
  "Nesprávne nastavené zálohy (alebo žiadne)",
  "Otvorené porty na servery",
  "Heslá zamestnancov v databáze v čistom texte",
  "Chýbajúce HTTPS / zlý SSL setup",
  "Neexistujúci plán čo robiť pri incidente",
];

const Column = ({ title, code, items, accent }: { title: string; code: string; items: string[]; accent: "danger" | "ok" }) => (
  <div className="wire-border bg-background p-6 md:p-8">
    <div className="flex items-center justify-between mb-5">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{code}</div>
      <div className={`font-mono text-[10px] tracking-[0.2em] px-2 py-0.5 ${accent === "danger" ? "bg-foreground text-background" : "wire-border-solid"}`}>
        {accent === "danger" ? "ACTIVE THREATS" : "PREVENTIVE FIX"}
      </div>
    </div>
    <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-5">{title}</h3>
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3 text-sm leading-snug">
          <span className="font-mono text-xs text-primary mt-0.5 shrink-0">
            {accent === "danger" ? "[!]" : "[✓]"}
          </span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const WatchedThreats = () => (
  <section id="hrozby" className="mt-28 scroll-mt-24">
    <SectionMarker num="04" label="Sledované hrozby" />
    <div className="mb-10 max-w-3xl">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
        Čo presne <span className="italic font-light text-primary">strážime</span>
      </h2>
      <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
        Nie marketingové bla-bla. Konkrétne útoky, ktoré denne chytáme, a konkrétne diery, ktoré opravujeme skôr, než ich niekto využije.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      <Column title="Útoky, ktoré chytáme" code="THR_01" items={attacks} accent="danger" />
      <Column title="Problémy, ktoré riešime preventívne" code="THR_02" items={prevention} accent="ok" />
    </div>
  </section>
);
