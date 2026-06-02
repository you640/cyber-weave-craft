import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  delta?: { value: string; trend: "up" | "down" | "flat" };
  icon?: ReactNode;
  sparkline?: number[];
  tone?: "default" | "success" | "warning" | "danger" | "info";
}

const TONE_BG: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "",
  success: "before:bg-success/40",
  warning: "before:bg-warning/40",
  danger: "before:bg-danger/40",
  info: "before:bg-info/40",
};

const Sparkline = ({ points, tone }: { points: number[]; tone: NonNullable<StatCardProps["tone"]> }) => {
  if (!points.length) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const step = w / (points.length - 1 || 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)},${(h - ((p - min) / range) * h).toFixed(2)}`)
    .join(" ");
  const stroke =
    tone === "success" ? "hsl(var(--success))" :
    tone === "warning" ? "hsl(var(--warning))" :
    tone === "danger"  ? "hsl(var(--danger))"  :
    tone === "info"    ? "hsl(var(--info))"    :
    "hsl(var(--primary))";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7 mt-3" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} />
    </svg>
  );
};

export const StatCard = ({ label, value, hint, delta, icon, sparkline, tone = "default" }: StatCardProps) => {
  const trendColor =
    delta?.trend === "up" ? "text-success" : delta?.trend === "down" ? "text-danger" : "text-muted-foreground";
  const arrow = delta?.trend === "up" ? "↑" : delta?.trend === "down" ? "↓" : "→";

  return (
    <div
      className={cn(
        "surface-card hover-lift p-5 relative overflow-hidden",
        "before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:opacity-80",
        TONE_BG[tone],
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
          {label}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
          {value}
        </div>
        {delta && (
          <span className={cn("text-xs font-mono", trendColor)}>
            {arrow} {delta.value}
          </span>
        )}
      </div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      {sparkline && sparkline.length > 1 && <Sparkline points={sparkline} tone={tone} />}
    </div>
  );
};
