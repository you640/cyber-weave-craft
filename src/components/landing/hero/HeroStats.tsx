import { ShieldCheck, Clock, Calendar, Headset, type LucideIcon } from "lucide-react";
import { useCountUp, useInView } from "@/hooks/use-count-up";

type Stat = {
  label: string;
  val: number;
  prefix?: string;
  suffix?: string;
  sub: string;
  Icon: LucideIcon;
};

const stats: Stat[] = [
  { label: "Dohľad", val: 24, suffix: "/7", sub: "365 dní v roku", Icon: ShieldCheck },
  { label: "Reakcia", val: 4, prefix: "< ", suffix: "h", sub: "aj mimo pracovného času", Icon: Clock },
  { label: "Služba", val: 365, sub: "bez sezónneho spánku", Icon: Calendar },
  { label: "Podpora", val: 7, suffix: "/7", sub: "incident si kalendár nepýta", Icon: Headset },
];

const StatBox = ({ s, enabled }: { s: Stat; enabled: boolean }) => {
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

export const HeroStats = () => {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
      {stats.map((s) => (
        <StatBox key={s.label} s={s} enabled={inView} />
      ))}
    </div>
  );
};
