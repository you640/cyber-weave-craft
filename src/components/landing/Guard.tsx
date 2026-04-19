import { SectionMarker, WireAnnotation } from "./WireAnnotation";

const pillars = [
  {
    code: "G_01",
    icon: "👁",
    title: "Pozeráme sa stále",
    body: "24 hodín denne sledujeme prístupy na váš web. Vidíme každú podozrivú IP adresu, každý pokus o heslo, každú chybu servera — aj o tretej ráno cez sviatky.",
  },
  {
    code: "G_02",
    icon: "🚨",
    title: "Alarmujeme okamžite",
    body: "Keď sa niečo deje — útok, výpadok, podozrivá aktivita — dostanete notifikáciu na telefón do 60 sekúnd. Nie ráno. Nie zajtra. Hneď.",
  },
  {
    code: "G_03",
    icon: "🛡",
    title: "Blokujeme útoky",
    body: "Botnety, skúšanie hesiel, scrapery, DDoS záplavy — všetko zastavíme automaticky. Vy len v týždennom reporte vidíte, koľko útokov sme odrazili.",
  },
  {
    code: "G_04",
    icon: "🚑",
    title: "Zachraňujeme keď treba",
    body: "Hacknutý web? Vymazaná databáza? Volajte hocikedy. Sme na drôte do 4 hodín — aj cez víkend, aj cez Vianoce, aj keď vy spíte.",
  },
];

const targets = [
  "Eshopy (Shopify, WooCommerce, vlastné riešenia)",
  "Firemné weby s formulármi a citlivými dátami",
  "SaaS aplikácie a API",
  "Booking / rezervačné systémy",
  "Akýkoľvek web kde výpadok = strata peňazí",
];

export const Guard = () => (
  <section id="strážna-služba" className="mt-28 scroll-mt-24">
    <SectionMarker num="01" label="Nonstop dohľad" />

    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Ako vyzerá <span className="italic font-light text-primary">strážna služba</span> pre digitálny biznis
        </h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
          To, čo SBS robí pre kamenný obchod, my robíme pre ten online — len rýchlejšie, presnejšie a bez uniformy. Štyri jednoduché veci, 365 dní v roku.
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
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-4">
          Pre koho je strážna služba
        </h3>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {targets.map((t) => (
            <li key={t} className="flex gap-3 text-sm leading-snug">
              <span className="font-mono text-xs text-primary mt-0.5 shrink-0">[✓]</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs font-mono text-muted-foreground tracking-wider">
          // chránime eshopy s obratom od 10 000 € po 5 000 000 € ročne
        </p>
      </div>
    </div>
  </section>
);
