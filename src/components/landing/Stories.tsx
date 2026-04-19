import { SectionMarker, WireAnnotation } from "./WireAnnotation";

const stories = [
  {
    code: "CASE_01",
    title: "Eshop s kozmetikou",
    when: "piatok · 23:47",
    body: "Botnet zo 4 000 IP adries skúšal prelomiť admin účet. Naše alarmy zacvičili o 23:48. O 23:51 boli všetky IP adresy zablokované. Klient sa o útoku dozvedel ráno z reportu.",
    outcome: "Nestratil ani jednu objednávku.",
  },
  {
    code: "CASE_02",
    title: "B2B portál",
    when: "utorok · 9:14",
    body: "Bývalý zamestnanec sa skúsil prihlásiť starým heslom z neznámej krajiny. Detekovali sme to za 6 sekúnd, zablokovali účet a upozornili majiteľa firmy telefonicky.",
    outcome: "Odhadovaná škoda v ukradnutých kontaktoch: 80 000 €.",
  },
  {
    code: "CASE_03",
    title: "Rezervačný systém",
    when: "nedeľa · 4:33",
    body: "Server spadol pre chybu v automatickom update. Telefonát klientovi o 4:35, oprava hotová o 5:20. Bookovanie zase fungovalo skôr, než sa zobudil prvý hosť.",
    outcome: "Žiadny zákazník si nič nevšimol.",
  },
];

export const Stories = () => (
  <section id="príbehy" className="mt-28 scroll-mt-24">
    <SectionMarker num="06" label="Príbehy z praxe" />

    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
      <div className="max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Z reálnych <span className="italic font-light text-primary">nocí v službe</span>
        </h2>
        <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
          Bez mien klientov, ale s reálnymi časmi a číslami. Takto vyzerá strážna služba v praxi.
        </p>
      </div>
      <div className="hidden md:block">
        <WireAnnotation rotate={4}>žiadny príbeh nie je vymyslený</WireAnnotation>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-5">
      {stories.map((s) => (
        <article key={s.code} className="wire-border bg-background p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">{s.code}</span>
            <span className="font-mono text-[10px] text-primary">● LIVE LOG</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">{s.title}</h3>
          <div className="font-mono text-[11px] text-muted-foreground tracking-wider mt-1 mb-4">{s.when}</div>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.body}</p>
          <div className="mt-5 pt-4 border-t border-dashed border-[hsl(var(--wire-line))]">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">// výsledok</div>
            <div className="text-sm font-medium text-foreground">{s.outcome}</div>
          </div>
        </article>
      ))}
    </div>
  </section>
);
