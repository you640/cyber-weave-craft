import { ReactNode } from "react";

interface Props {
  url?: string;
  children: ReactNode;
  className?: string;
}

export const BrowserFrame = ({ url = "nexify.guard/dashboard", children, className = "" }: Props) => (
  <div className={`wire-border-solid bg-background overflow-hidden wire-shadow ${className}`}>
    <div className="flex items-center gap-2 px-3 py-2 border-b border-foreground/20 bg-[hsl(var(--wire-bg-soft))]">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[hsl(45_90%_55%)]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[hsl(140_60%_45%)]" />
      </div>
      <div className="flex-1 mx-2 px-2 py-0.5 wire-border bg-background font-mono text-[10px] text-muted-foreground truncate">
        🔒 {url}
      </div>
      <span className="font-mono text-[9px] text-muted-foreground tracking-wider">LIVE</span>
    </div>
    <div className="relative">{children}</div>
  </div>
);
