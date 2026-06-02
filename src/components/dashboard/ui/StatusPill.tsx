import { cn } from "@/lib/utils";

export type StatusTone = "ok" | "warn" | "err" | "info" | "idle" | "loading";

const TONE: Record<StatusTone, { dot: string; bg: string; text: string; label: string }> = {
  ok:      { dot: "bg-success",        bg: "bg-success/10 border-success/30",            text: "text-success",        label: "ONLINE" },
  warn:    { dot: "bg-warning",        bg: "bg-warning/10 border-warning/30",            text: "text-warning",        label: "WARNING" },
  err:     { dot: "bg-danger",         bg: "bg-danger/10 border-danger/30",              text: "text-danger",         label: "ERROR" },
  info:    { dot: "bg-info",           bg: "bg-info/10 border-info/30",                  text: "text-info",           label: "INFO" },
  idle:    { dot: "bg-muted-foreground/60", bg: "bg-muted border-[hsl(var(--border-subtle))]", text: "text-muted-foreground", label: "IDLE" },
  loading: { dot: "bg-info animate-pulse-dot", bg: "bg-info/10 border-info/30",          text: "text-info",           label: "LOADING" },
};

interface StatusPillProps {
  tone: StatusTone;
  label?: string;
  className?: string;
}

export const StatusPill = ({ tone, label, className }: StatusPillProps) => {
  const t = TONE[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-mono tracking-[0.2em] uppercase",
        t.bg,
        t.text,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", t.dot)} />
      {label ?? t.label}
    </span>
  );
};
