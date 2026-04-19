import { SectionMarker, WireAnnotation } from "./WireAnnotation";
import { cn } from "@/lib/utils";

const retainers = [
  {
    name: "Watch",
    tag: "Monitoring tier",
    price: "249",
    desc: "Kontinuálny log monitoring, alerting pri podozrivej aktivite, mesačný report, e-mailová podpora. Ideálne pre SME s jedným webom.",
  },
  {
    name: "Guard",
    tag: "Active defense",
    price: "690",
    featured: true,
    desc: "Watch + aktívna reakcia na incidenty (4h SLA), WAF správa, kvartálny mini-audit, 4h konzultácií mesačne. Pre firmy 10–50 ľudí.",
  },
  {
    name: "Fortress",
    tag: "Full coverage",
    price: "1 890",
    desc: "Guard + dedicated engineer, 24/7 incident response SLA (1h reakcia), mesačný pentest nových features, NIS2/ISO 27001 support.",
  },
];

export const Retainers = () => (
  <section id="retainery" className="mt-28 scroll-mt-24">
    <SectionMarker num="04" label="Retainery" />
    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
      <div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Mesačné <span className="italic font-light text-primary">paušály</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl text-sm md:text-base">
          Pre firmy, ktoré chcú kontinuálnu ochranu a nie jednorazový audit. Monitoring, reakcia, kvartálne re-audity.
        </p>
      </div>
      <WireAnnotation rotate={-2} className="hidden md:inline">cancel anytime ✕</WireAnnotation>
    </div>

    <div className="grid md:grid-cols-3 gap-5">
      {retainers.map((r) => (
        <div
          key={r.name}
          className={cn(
            "relative wire-border bg-background p-6 transition-all hover:-translate-y-1",
            r.featured && "wire-border-solid wire-shadow",
          )}
        >
          {r.featured && (
            <div className="absolute -top-3 left-6 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] px-2 py-1">
              RECOMMENDED
            </div>
          )}
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-primary mb-1">{r.tag}</div>
          <h3 className="text-2xl font-bold tracking-tight">{r.name}</h3>

          <div className="mt-5 flex items-baseline gap-1">
            <span className="font-mono text-4xl font-bold">{r.price}</span>
            <span className="font-mono text-base text-muted-foreground">€ / mes</span>
          </div>

          <p className="mt-5 pt-5 border-t border-dashed border-[hsl(var(--wire-line))] text-sm text-muted-foreground leading-relaxed">
            {r.desc}
          </p>

          <button
            className={cn(
              "mt-6 w-full font-mono text-xs py-3 transition-all",
              r.featured
                ? "bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                : "wire-border hover:bg-foreground hover:text-background",
            )}
          >
            [ Vybrať {r.name} → ]
          </button>
        </div>
      ))}
    </div>
  </section>
);
