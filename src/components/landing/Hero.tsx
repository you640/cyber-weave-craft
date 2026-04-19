import { PlaceholderBox } from "./PlaceholderBox";
import { WireAnnotation, WireArrow } from "./WireAnnotation";

const stats = [
  { label: "Detekčné pokrytie", val: "200+", sub: "CVE & exploit patterns" },
  { label: "Reakčný čas", val: "< 4h", sub: "incident response" },
  { label: "Audit reporty", val: "PDF", sub: "+ nginx/WAF konfig" },
  { label: "GDPR / NIS2", val: "✓", sub: "SK 18/2018 + EU" },
];

export const Hero = () => (
  <header className="mt-12 md:mt-16">
    <div className="inline-flex items-center gap-2 wire-border px-3 py-1.5 mb-8">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Cenník 2026 · SK / CZ trh</span>
    </div>

    <div className="grid lg:grid-cols-12 gap-10 items-start">
      <div className="lg:col-span-7">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight">
          Kybernetická
          <br />
          bezpečnosť
          <br />
          <span className="relative inline-block">
            <span className="italic font-light text-primary">bez kompromisov</span>
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 300 8" preserveAspectRatio="none">
              <path d="M2 5 Q 75 1, 150 4 T 298 3" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <div className="relative mt-8 max-w-xl">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Kompletný katalóg služieb ochrany webových aplikácií, serverov a SaaS produktov pre slovenský a český trh.{" "}
            <span className="text-foreground font-medium">Fixné ceny, žiadne skryté poplatky</span>, každý výstup ako auditný report s konkrétnymi krokmi.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button className="font-mono text-xs px-5 py-3 bg-primary text-primary-foreground wire-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            [ Objednať audit → ]
          </button>
          <button className="font-mono text-xs px-5 py-3 wire-border bg-background hover:bg-[hsl(var(--wire-bg-soft))] transition-colors">
            Stiahnuť cenník (PDF)
          </button>
          <div className="hidden md:flex items-center gap-1 ml-2">
            <WireArrow className="w-12" />
            <WireAnnotation rotate={-6}>začni tu!</WireAnnotation>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
          {stats.map((s) => (
            <div key={s.label} className="wire-border p-4 bg-background hover:bg-[hsl(var(--wire-bg-soft))] transition-colors">
              <div className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase mb-2">{s.label}</div>
              <div className="font-mono text-2xl font-bold text-foreground leading-none">{s.val}</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-2">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 lg:sticky lg:top-28">
        <div className="relative">
          <div className="absolute -top-3 -left-3 z-10 wire-border-solid bg-background px-2 py-0.5 font-mono text-[10px] tracking-wider">
            FIG_01 · dashboard.png
          </div>
          <PlaceholderBox label="dashboard preview" ratio="aspect-[5/4]" />
          <div className="absolute -right-2 top-1/3 hidden lg:flex items-center">
            <WireAnnotation rotate={8} className="text-xl">live SIEM ↑</WireAnnotation>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <PlaceholderBox label="logs" ratio="aspect-square" showCross={false} />
          <PlaceholderBox label="alerts" ratio="aspect-square" showCross={false} />
          <PlaceholderBox label="report" ratio="aspect-square" showCross={false} />
        </div>
      </div>
    </div>
  </header>
);
