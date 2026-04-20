import { useEffect, useState } from "react";
import { ArrowRight, Play, ShieldCheck, Clock, Calendar, Headset, Bell } from "lucide-react";
import { WireAnnotation, WireArrow } from "./WireAnnotation";
import { AnnouncementTicker } from "./AnnouncementTicker";
import { BrowserFrame } from "./BrowserFrame";
import { TechMarquee } from "./TechMarquee";
import { useCountUp, useInView } from "@/hooks/use-count-up";
import dashboardImg from "@/assets/dashboard.png";
import logsImg from "@/assets/logs.png";
import alertsImg from "@/assets/alerts.png";
import reportImg from "@/assets/report.png";

const stats = [
  { label: "Dohľad", val: 24, suffix: "/7", sub: "365 dní v roku", Icon: ShieldCheck },
  { label: "Reakcia", val: 4, prefix: "< ", suffix: "h", sub: "aj mimo pracovného času", Icon: Clock },
  { label: "Služba", val: 365, sub: "bez sezónneho spánku", Icon: Calendar },
  { label: "Podpora", val: 7, suffix: "/7", sub: "incident si kalendár nepýta", Icon: Headset },
];

const rotatingWords = ["bez stráže.", "bez logov.", "bez záchrannej siete."];

const StatBox = ({
  s,
  enabled,
}: {
  s: (typeof stats)[number];
  enabled: boolean;
}) => {
  const value = useCountUp(s.val, 1400, enabled);
  const { Icon } = s;
  return (
    <div className="group wire-border p-4 bg-background hover:bg-[hsl(var(--wire-bg-soft))] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase">
          {s.label}
        </div>
        <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="font-mono text-2xl font-bold text-foreground leading-none tabular-nums">
        {s.prefix ?? ""}
        {value}
        {s.suffix ?? ""}
      </div>
      <div className="font-mono text-[10px] text-muted-foreground mt-2">{s.sub}</div>
    </div>
  );
};

export const Hero = () => {
  const [wordIdx, setWordIdx] = useState(0);
  const { ref: statsRef, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % rotatingWords.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="mt-10 md:mt-14">
      <div className="mb-8">
        <AnnouncementTicker />
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* LEFT */}
        <div className="lg:col-span-7">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight">
            Váš web nemá
            <br />
            zostať v noci
            <br />
            <span className="relative inline-block min-h-[1.1em]">
              <span
                key={wordIdx}
                className="font-display italic font-light text-primary inline-block animate-fade-in"
              >
                {rotatingWords[wordIdx]}
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 300 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 5 Q 75 1, 150 4 T 298 3"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <div className="relative mt-8 max-w-xl">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Keď slušní ľudia zavrú notebook, internet ešte len začína byť kreatívny.{" "}
              <span className="text-foreground font-medium">
                Boti nespia. Scraperom je jedno, že je sviatok.
              </span>
            </p>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              Nexify Guard sleduje váš web, eshop alebo aplikáciu nepretržite. Keď niečo padne o tretej ráno, nezobudí vás zákazník — riešime to my.
            </p>
            <p className="mt-3 font-mono text-xs text-muted-foreground tracking-wider">
              // pre firmy, kde výpadok = strata peňazí, reputácie alebo oboch
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="relative">
              <span className="absolute inset-0 bg-primary/40 animate-ping rounded-sm" aria-hidden />
              <button className="relative group inline-flex items-center gap-2 font-mono text-sm px-6 py-3.5 bg-primary text-primary-foreground wire-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                Objednať audit zdarma
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <button className="group inline-flex items-center gap-2 font-mono text-sm px-5 py-3.5 wire-border bg-background hover:bg-[hsl(var(--wire-bg-soft))] transition-colors">
              <Play className="w-3.5 h-3.5 fill-current" />
              Pozrieť demo (2 min)
            </button>
            <div className="hidden md:flex items-center gap-1 ml-1">
              <WireArrow className="w-10" />
              <WireAnnotation rotate={-6}>začni tu!</WireAnnotation>
            </div>
          </div>

          <p className="mt-4 font-mono text-[11px] text-muted-foreground tracking-wider">
            ✓ Bez kreditky &nbsp;·&nbsp; ✓ Audit do 24h &nbsp;·&nbsp; ✓ Žiadny záväzok
          </p>

          {/* STATS */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            {stats.map((s) => (
              <StatBox key={s.label} s={s} enabled={inView} />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="relative">
            <div className="absolute -top-3 -left-3 z-10 wire-border-solid bg-background px-2 py-0.5 font-mono text-[10px] tracking-wider">
              FIG_01 · dashboard.png
            </div>

            <BrowserFrame>
              <div className="aspect-[5/4]">
                <img
                  src={dashboardImg}
                  alt="Wireframe náhľad bezpečnostného dashboardu Nexify Guard"
                  width={1280}
                  height={1024}
                  className="w-full h-full object-cover"
                />
              </div>
            </BrowserFrame>

            {/* floating notification */}
            <div className="absolute -bottom-4 -left-4 z-10 wire-border-solid bg-background p-3 wire-shadow-sm max-w-[230px] animate-fade-in">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 shrink-0 rounded-sm bg-destructive/15 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-destructive" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-bold tracking-wider uppercase">
                    Brute-force blokovaný
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground mt-0.5">
                    IP 185.220.x.x · pred 12s
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 top-1/3 hidden lg:flex items-center">
              <WireAnnotation rotate={8} className="text-xl">
                live SIEM ↑
              </WireAnnotation>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { src: logsImg, alt: "Log forensics", label: "logs" },
              { src: alertsImg, alt: "Incident kanban", label: "alerts" },
              { src: reportImg, alt: "PDF audit report", label: "report" },
            ].map((img) => (
              <div
                key={img.alt}
                className="group relative wire-border bg-background overflow-hidden aspect-square"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 px-2 py-1 bg-background/90 border-t border-dashed border-foreground/30 font-mono text-[9px] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  ▍ {img.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TechMarquee />
    </header>
  );
};
