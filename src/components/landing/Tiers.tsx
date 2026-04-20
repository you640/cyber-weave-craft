import { SectionMarker, WireAnnotation, WireArrow } from "./WireAnnotation";
import { cn } from "@/lib/utils";

const tiers = [
  {
    code: "T_01",
    name: "Strážny",
    target: "SME / živnostníci / malé weby",
    price: "249",
    note: "jednorazovo · bez DPH",
    cta: "Objednať Strážneho",
    promise: "Pokojný spánok je lacnejší, keď stojí 249 € a nie obnovu po prieniku.",
    features: [
      "Audit prístupových logov za posledných 7 dní",
      "Hardening WordPressu (heslá, prihlasovanie, xmlrpc)",
      "Kontrola HTTPS / SSL certifikátu",
      "PDF report — 10 až 15 strán, ľudskou rečou",
      "Implementačný návod krok po kroku",
      "E-mailová podpora 7 dní po dodaní",
    ],
  },
  {
    code: "T_02",
    name: "Ochranca",
    target: "Firmy 10–50 / SaaS / eshopy",
    price: "1 290",
    note: "jednorazovo · bez DPH",
    cta: "Objednať Ochrancu",
    popular: true,
    promise: "Lacnejšie než incident. Oveľa menej trápne než vysvetľovať klientom, prečo im nefunguje checkout.",
    features: [
      "Všetko z balíka Strážny",
      "Pentest aplikácie — top 10 najčastejších útokov",
      "Hardening servera (SSH, firewall, fail2ban)",
      "Nasadenie ochranného múru (Cloudflare / ModSec)",
      "Monitoring v reálnom čase (grafy + alerty)",
      "GDPR audit — cookies, retencia, DPA zmluvy",
      "Plán čo robiť pri incidente (runbook)",
      "30 dní podpory + 1 hodina konzultácie",
    ],
  },
  {
    code: "T_03",
    name: "Telochranca",
    target: "Agentúry / SaaS >10k / fintech",
    price: "3 890",
    note: "jednorazovo + mesačný paušál · bez DPH",
    cta: "Objednať Telochrancu",
    promise: "Keď váš systém živí firmu, nemá byť chránený na úrovni „snáď to vydrží".",
    features: [
      "Všetko z balíka Ochranca",
      "Hĺbkový pentest — black/grey box, API útoky",
      "DevSecOps — databáza, tokeny, tajné kľúče",
      "Audit infraštruktúry (AWS / Vercel, prístupy)",
      "Revízia zdrojového kódu (automaticky + ručne)",
      "Príprava na NIS2 / ISO 27001",
      "24/7 incident response so zmluvnou SLA",
      "90 dní podpory + mesačný sync hovor",
    ],
  },
];

export const Tiers = () => (
  <section id="balíčky" className="mt-28 scroll-mt-24">
    <SectionMarker num="01" label="Balíčky" />
    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
      <div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Tri úrovne <span className="italic font-light text-primary">ochrany</span>. Bez hmly, bez kúziel, bez prekvapení na faktúre.
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed">
          Nie každý projekt potrebuje pevnosť. Niekedy stačí zamknúť dvere a skontrolovať okná. Niekedy už ale nestačí nič menšie než poriadna obrana, monitoring a plán, čo robiť, keď veci začnú horieť.
        </p>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <WireAnnotation rotate={-3}>fixné ceny, žiadne prekvapenia</WireAnnotation>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-5">
      {tiers.map((t) => (
        <div
          key={t.code}
          className={cn(
            "relative wire-border bg-background p-6 md:p-8 flex flex-col transition-all hover:-translate-y-1",
            t.popular && "wire-border-solid wire-shadow-primary",
          )}
        >
          {t.popular && (
            <>
              <div className="absolute -top-3 left-6 bg-primary text-primary-foreground font-mono text-[10px] tracking-[0.2em] px-2 py-1">
                ★ POPULAR
              </div>
              <div className="absolute -right-4 top-12 hidden lg:flex flex-col items-start">
                <WireArrow className="w-14" />
                <WireAnnotation rotate={6} className="text-xl -mt-1">vyber tento</WireAnnotation>
              </div>
            </>
          )}

          <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
            Tier · {t.code}
          </div>
          <h3 className="text-3xl font-bold tracking-tight">{t.name}</h3>
          <p className="font-mono text-xs text-muted-foreground mt-1">{t.target}</p>

          <div className="mt-6 pb-6 border-b border-dashed border-[hsl(var(--wire-line))]">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl font-bold">{t.price}</span>
              <span className="font-mono text-xl text-muted-foreground">€</span>
            </div>
            <div className="font-mono text-[11px] text-muted-foreground mt-1">{t.note}</div>
          </div>

          <p className="mt-5 text-sm leading-snug text-foreground/80 italic">
            „{t.promise}“
          </p>

          <ul className="mt-5 space-y-2.5 flex-1">
            {t.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm leading-snug">
                <span className="font-mono text-xs text-primary mt-0.5 shrink-0">[✓]</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button
            className={cn(
              "mt-6 w-full font-mono text-xs py-3 transition-all",
              t.popular
                ? "bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                : "wire-border hover:bg-foreground hover:text-background",
            )}
          >
            [ {t.cta} → ]
          </button>
        </div>
      ))}
    </div>
  </section>
);
