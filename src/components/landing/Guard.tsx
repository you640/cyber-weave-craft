import { SectionMarker, WireAnnotation } from "./WireAnnotation";

const pillars = [
  {
    code: "G_01",
    icon: "👁",
    title: "Pozeráme sa stále",
    body: "Sledujeme prístupy na váš web, administráciu, formuláre, API aj správanie servera. Vidíme podozrivé IP adresy, neobvyklé login pokusy, chyby aplikácie aj zvláštne requesty, ktoré slušný používateľ jednoducho neposiela.",
  },
  {
    code: "G_02",
    icon: "🚨",
    title: "Alarmujeme hneď",
    body: "Keď sa niečo deje, nedozviete sa to ráno pri káve. Dostanete upozornenie vtedy, keď má zmysel konať — nie keď už škoda stihla pohodlne zaparkovať.",
  },
  {
    code: "G_03",
    icon: "🛡",
    title: "Brzdíme útoky",
    body: "Brute-force, scraping, credential stuffing, podozrivé payloady, DDoS šum aj lacné pokusy o prienik. Čo sa dá zastaviť automaticky, zastavíme. Čo potrebuje ľudský zásah, eskalujeme bez divadla a bez hrdinských monológov.",
  },
  {
    code: "G_04",
    icon: "🚑",
    title: "Keď horí, hasíme",
    body: "Ak dôjde ku kompromitácii, výpadku alebo incidentu, neriešime powerpoint. Riešime triáž, izoláciu, obnovu, dôkazy a ďalšie kroky. Pretože v kríze je najhorší ten človek, ktorý veľa rozpráva a nič nevypína.",
  },
];

const targets = [
  "eshopy na Shopify, WooCommerce aj custom riešeniach",
  "firemné weby s formulármi, databázami a citlivými dátami",
  "SaaS aplikácie a API",
  "booking a rezervačné systémy",
  "akýkoľvek projekt, kde výpadok = problém v peniazoch",
];

export const Guard = () => (
  <section id="strážna-služba" className="mt-28 scroll-mt-24">
    <SectionMarker num="01" label="Nonstop dohľad" />

    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Digitálna <span className="font-display italic font-light text-primary">strážna služba</span> pre biznis, ktorý nemá čas na paniku
        </h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
          Kamenný obchod má alarm, kameru a pult centrálnej ochrany. Online biznis potrebuje to isté — len namiesto dverí sledujeme endpointy, namiesto výkladu API a namiesto podozrivého pohybu logy, requesty a anomálie.
        </p>
        <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
          Nie je to romantika. Je to disciplína. A disciplína býva lacnejšia než incident.
        </p>
      </div>
      <div className="hidden md:block">
        <WireAnnotation rotate={-4}>vy spíte, my strážime</WireAnnotation>
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
      {pillars.map((p) => (
        <div
          key={p.code}
          className="relative wire-border bg-background p-6 flex flex-col transition-all hover:-translate-y-1 hover:wire-shadow-sm"
        >
          <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-4">
            {p.code}
          </div>
          <div className="text-4xl mb-4 leading-none">{p.icon}</div>
          <h3 className="text-lg font-bold tracking-tight mb-2">{p.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
        </div>
      ))}
    </div>

    <div className="mt-10 wire-border bg-[hsl(var(--wire-bg-soft))] p-6 md:p-8 grid lg:grid-cols-[auto_1fr] gap-6 items-start">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground lg:writing-mode-vertical shrink-0">
        // pre koho
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
          Pre koho má zmysel mať stráž
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Táto služba nie je pre každého. Je pre tých, ktorí vedia, že web nie je vizitka, ale prevádzka.
        </p>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {targets.map((t) => (
            <li key={t} className="flex gap-3 text-sm leading-snug">
              <span className="font-mono text-xs text-primary mt-0.5 shrink-0">[✓]</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs font-mono text-muted-foreground tracking-wider">
          // chránime firmy od menších webov až po prevádzky, kde sa chyba nevolá „bug", ale „mesačný problém vo výsledovke"
        </p>
      </div>
    </div>
  </section>
);
