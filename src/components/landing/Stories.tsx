import { SectionMarker, WireAnnotation } from "./WireAnnotation";

const stories = [
  {
    code: "CASE_01",
    title: "Eshop s kozmetikou",
    when: "piatok · neskoro večer",
    body: "Prišla vlna login pokusov z tisícok adries. Nie zákazníci. Len internet vo svojej menej civilizovanej forme. Alarm sa ozval v minútach, nie hodinách. Bloky sa nasadili skôr, než sa niekto dostal hlbšie. Klient sa ráno zobudil do normálne fungujúceho eshopu a reportu, nie do krízového telefonátu.",
    outcome: "Prevádzka pokračovala. Objednávky tiež.",
  },
  {
    code: "CASE_02",
    title: "B2B portál",
    when: "utorok · ráno",
    body: "Staré heslo, nový pokus, cudzia krajina, nesprávny čas. Klasika. Smutná, ale klasika. Prístup sme zastavili okamžite, účet uzamkli, vlastníka kontaktovali a ďalej už nasledovala prevencia, nie škoda.",
    outcome: "Dáta ostali tam, kde mali. A bývalý zamestnanec si o pár minút neskôr zrejme uvedomil, že tentoraz to nebolo také jednoduché.",
  },
  {
    code: "CASE_03",
    title: "Rezervačný systém",
    when: "nedeľa · 4:33",
    body: "Server sa rozhodol, že nedeľa o štvrtej ráno je ideálny čas na existenčnú krízu po update. My sme s tým nesúhlasili. Diagnostika, zásah, obnova služby. Skôr než sa zobudil prvý hosť, systém bežal.",
    outcome: 'Žiadna panika, žiadna verejná hanba, žiadne „prosím skúste to neskôr".',
  },
];

export const Stories = () => (
  <section id="príbehy" className="mt-28 scroll-mt-24">
    <SectionMarker num="06" label="Príbehy z praxe" />

    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
      <div className="max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Príbehy, ktoré by vyzerali ako <span className="font-display italic font-light text-primary">bájky</span>, keby neboli v logoch
        </h2>
        <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
          Bez mien klientov. Bez zbytočnej drámy. Len reálne situácie, kde rozhodovali minúty, nie marketingové heslá.
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
