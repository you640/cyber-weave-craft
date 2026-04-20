import { SectionMarker } from "./WireAnnotation";

const attacks = [
  "pokusy uhádnuť heslo do administrácie",
  "scrapovanie cien, obsahu a produktových dát",
  "carding a falošné objednávky",
  "DDoS a preťažovanie prevádzky",
  "SQL injection a pokusy čítať databázu cez cudzie dvere",
  "nahrávanie škodlivého obsahu cez formuláre",
  "credential stuffing a prevzatie účtov",
];

const prevention = [
  "staré pluginy a knižnice s verejne známou dierou",
  "zle nastavené alebo neotestované zálohy",
  "otvorené porty, ktoré nemajú byť otvorené",
  "slabé prístupy a zlá správa účtov",
  "SSL/TLS nastavenie, ktoré pôsobí moderne len na papieri",
  "neexistujúci plán, čo robiť, keď sa niečo pokazí",
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
        Nechytáme duchov. Chytáme <span className="font-display italic font-light text-primary">konkrétne pokusy</span>.
      </h2>
      <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
        Väčšina útokov nevyzerá ako hollywoodsky hacker v kapucni. Vyzerá ako lacný skript, botnet, ukradnuté heslo, zraniteľný plugin a admin konto, ktoré sa už roky modlí namiesto používania 2FA.
      </p>
      <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
        Útočník často nie je génius. Len skúša dosť dlho a dosť často. To býva nepríjemne postačujúce.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      <Column title="Útoky, ktoré sledujeme" code="THR_01" items={attacks} accent="danger" />
      <Column title="Preventívne problémy, ktoré riešime" code="THR_02" items={prevention} accent="ok" />
    </div>

    <p className="mt-6 font-mono text-[11px] tracking-wider text-muted-foreground">
      // lebo „dúfame, že sa nič nestane" nie je stratégia. To je len technický folklór.
    </p>
  </section>
);
