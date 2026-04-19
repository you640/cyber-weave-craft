import { useCounter } from "@/hooks/use-counter";
import { useEffect, useState } from "react";

const formatNum = (n: number) => n.toLocaleString("sk-SK").replace(/\s/g, " ");

const Sparkline = ({ values }: { values: number[] }) => {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 200;
  const h = 40;
  const step = w / (values.length - 1);
  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10 mt-2" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={`0,${h} ${points} ${w},${h}`}
        fill="hsl(var(--primary) / 0.08)"
        stroke="none"
      />
    </svg>
  );
};

const SubCounter = ({
  label,
  value,
  pct,
}: {
  label: string;
  value: number;
  pct: number;
}) => (
  <div className="border-t border-dashed border-[hsl(var(--wire-line))] pt-2">
    <div className="flex items-baseline justify-between">
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-sm font-bold tabular-nums">
        {formatNum(value)}
      </span>
    </div>
    <div className="mt-1 h-1 bg-[hsl(var(--wire-bg-soft))] relative overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-primary transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  </div>
);

export const CounterStack = () => {
  const total = useCounter({
    baseAtMidnight: 12,
    ratePerSecond: 0.55,
    minTickMs: 700,
    maxTickMs: 2400,
    minStep: 1,
    maxStep: 6,
  });

  const brute = Math.round(total * 0.45);
  const ddos = Math.round(total * 0.25);
  const sqli = Math.round(total * 0.18);
  const bot = total - brute - ddos - sqli;

  const [history, setHistory] = useState<number[]>(() =>
    Array.from({ length: 30 }, (_, i) => total - (29 - i) * 3)
  );

  useEffect(() => {
    const t = setInterval(() => {
      setHistory((h) => [...h.slice(1), total + Math.floor(Math.random() * 4)]);
    }, 2000);
    return () => clearInterval(t);
  }, [total]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="relative">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          Útokov zablokovaných dnes
        </div>
        <div className="font-mono text-5xl md:text-6xl font-bold tabular-nums tracking-tight mt-1 leading-none">
          {formatNum(total)}
        </div>
        <div className="absolute -top-2 -right-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-primary">
            live
          </span>
        </div>
        <Sparkline values={history} />
        <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-muted-foreground mt-1">
          posledných 60 minút →
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <SubCounter label="Brute-force" value={brute} pct={45} />
        <SubCounter label="DDoS" value={ddos} pct={25} />
        <SubCounter label="SQL injection" value={sqli} pct={18} />
        <SubCounter label="Bot scrapery" value={bot} pct={12} />
      </div>
    </div>
  );
};
