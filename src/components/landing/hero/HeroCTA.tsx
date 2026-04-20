import { ArrowRight, Play } from "lucide-react";
import { WireAnnotation, WireArrow } from "../WireAnnotation";

export const HeroCTA = () => {
  return (
    <>
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
    </>
  );
};
