import { useEffect, useState } from "react";
import { useAttackStreamContext } from "@/components/landing/AttackMap/AttackStreamContext";

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
        points={`0,${h} ${points} ${w},${h}`}
        fill="hsl(var(--primary) / 0.08)"
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
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
  const { counter, events } = useAttackStreamContext();

  // Derive sub-counters from real event distribution when possible, fall back to ratios.
  const total = counter;
  const typeCounts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1;
    return acc;
  }, {});
  const sumSeen = Object.values(typeCounts).reduce((a, b) => a + b, 0) || 1;
  const ratio = (keys: string[]) =>
    keys.reduce((a, k) => a + (typeCounts[k] ?? 0), 0) / sumSeen;

  // Fallback ratios
  const bruteR = sumSeen > 4 ? ratio(["brute-force", "credential-stuff"]) : 0.45;
  const ddosR = sumSeen > 4 ? ratio(["ddos"]) : 0.25;
  const sqliR = sumSeen > 4 ? ratio(["sql-inject", "rce-attempt", "path-traversal"]) : 0.18;

  const brute = Math.round(total * bruteR);
  const ddos = Math.round(total * ddosR);
  const sqli = Math.round(total * sqliR);
  const bot = Math.max(0, total - brute - ddos - sqli);

  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    setHistory((h) => {
      const next = [...h, total].slice(-30);
      return next;
    });
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
        <Sparkline values={history.length > 1 ? history : [total, total + 1]} />
        <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-muted-foreground mt-1">
          posledné minúty →
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <SubCounter label="Brute-force" value={brute} pct={Math.round(bruteR * 100)} />
        <SubCounter label="DDoS" value={ddos} pct={Math.round(ddosR * 100)} />
        <SubCounter label="SQL injection" value={sqli} pct={Math.round(sqliR * 100)} />
        <SubCounter label="Bot scrapery" value={bot} pct={Math.max(5, 100 - Math.round((bruteR + ddosR + sqliR) * 100))} />
      </div>
    </div>
  );
};
