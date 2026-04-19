export const GuardStatusBar = () => (
  <div className="mt-20 wire-border bg-[hsl(var(--wire-bg-soft))] px-5 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] tracking-wider">
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">// tento web stráži:</span>
      <span className="font-bold">NEXIFY GUARD</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      <span>STATUS: ALL SYSTEMS NORMAL</span>
    </div>
    <div className="text-muted-foreground">
      posledný incident: <span className="text-foreground">pred 47 dňami</span>
    </div>
  </div>
);
