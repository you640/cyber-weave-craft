import { useCounter } from "@/hooks/use-counter";

export const GuardStatusBar = () => {
  const activeThreats = useCounter({
    baseAtMidnight: 3,
    ratePerSecond: 0.02,
    minTickMs: 4000,
    maxTickMs: 9000,
    minStep: 1,
    maxStep: 2,
  });

  // Keep "active" small — show modulo so it feels like a live count
  const active = (activeThreats % 9) + 2;

  return (
    <div className="mt-12 wire-border bg-[hsl(var(--wire-bg-soft))] px-5 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-wider">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">// tento web stráži:</span>
        <span className="font-bold">NEXIFY GUARD</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>STATUS: ALL SYSTEMS NORMAL</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>active threats:</span>
        <span className="text-foreground font-bold tabular-nums">{active}</span>
      </div>
      <div className="text-muted-foreground">
        posledný incident: <span className="text-foreground">pred 47 dňami</span>
      </div>
    </div>
  );
};
