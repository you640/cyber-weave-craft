import { useAttackStreamContext } from "@/components/landing/AttackMap/AttackStreamContext";
import { cn } from "@/lib/utils";

const ACTION_CLASSES = {
  BLOCK: "text-primary",
  MITIGATE: "text-foreground",
  ALERT: "text-[hsl(var(--wire-handwritten))]",
} as const;

export const LiveLog = () => {
  const { events, connected } = useAttackStreamContext();
  const visible = events.slice(0, 12);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          // EVENT STREAM · tail -f
        </div>
        <div className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground">
          guard.log
        </div>
      </div>

      <div className="wire-border bg-[hsl(var(--wire-bg-soft))] flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-dashed border-[hsl(var(--wire-line))] px-3 py-1.5 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
          <span className="w-2 h-2 rounded-full border border-[hsl(var(--wire-line-strong))]" />
          <span className="w-2 h-2 rounded-full border border-[hsl(var(--wire-line-strong))]" />
          <span className="w-2 h-2 rounded-full border border-[hsl(var(--wire-line-strong))]" />
          <span className="ml-2 truncate">$ tail -f /var/log/nexify-guard.log</span>
          <span className="ml-auto inline-block w-1.5 h-3 bg-foreground animate-pulse" />
        </div>

        <div className="flex-1 overflow-hidden p-3 font-mono text-[11px] leading-5">
          {visible.length === 0 && (
            <div className="text-muted-foreground italic">
              connecting to edge stream…
            </div>
          )}
          {visible.map((log, i) => (
            <div
              key={log.id}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap overflow-hidden transition-opacity",
                i === 0 && "animate-fade-in",
                i > 7 && "opacity-50",
                i > 9 && "opacity-25",
              )}
            >
              <span className="text-muted-foreground tabular-nums shrink-0">
                [{log.timestamp}]
              </span>
              <span
                className={cn(
                  "font-bold shrink-0 w-[68px]",
                  ACTION_CLASSES[log.action] ?? "text-foreground",
                )}
              >
                {log.action}
              </span>
              <span className="text-foreground tabular-nums shrink-0 w-[110px]">
                {log.ip}
              </span>
              <span className="text-muted-foreground shrink-0 w-[28px]">
                {log.countryCode}
              </span>
              <span className="text-foreground shrink-0 w-[110px] truncate">
                {log.type}
              </span>
              <span className="text-muted-foreground truncate">{log.target}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-[hsl(var(--wire-line))] px-3 py-1.5 flex items-center justify-between font-mono text-[9px] tracking-[0.15em] uppercase text-muted-foreground">
          <span>source: edge function</span>
          <span>retention: 30 events</span>
          <span className={connected ? "text-primary" : "text-[hsl(var(--wire-handwritten))]"}>
            ● {connected ? "streaming" : "reconnecting"}
          </span>
        </div>
      </div>
    </div>
  );
};
