import { cn } from "@/lib/utils";

interface PlaceholderBoxProps {
  label?: string;
  className?: string;
  showCross?: boolean;
  ratio?: string;
}

export const PlaceholderBox = ({ label = "screenshot.png", className, showCross = true, ratio = "aspect-[4/3]" }: PlaceholderBoxProps) => (
  <div className={cn("relative wire-border bg-[hsl(var(--wire-bg-soft))] wire-hatch-soft overflow-hidden", ratio, className)}>
    {showCross && (
      <svg className="absolute inset-0 w-full h-full text-[hsl(var(--wire-line-strong))]" fill="none" stroke="currentColor" strokeWidth="1" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" />
        <line x1="100%" y1="0" x2="0" y2="100%" />
      </svg>
    )}
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="font-mono text-xs text-[hsl(var(--wire-line-strong))] bg-background px-3 py-1 wire-border-solid">
        {label}
      </span>
    </div>
  </div>
);

export const IconPlaceholder = ({ code }: { code: string }) => (
  <div className="relative w-12 h-12 wire-border bg-[hsl(var(--wire-bg-soft))] flex items-center justify-center shrink-0">
    <span className="font-mono text-[9px] text-[hsl(var(--wire-line-strong))]">{code}</span>
    <svg className="absolute inset-0 w-full h-full text-[hsl(var(--wire-line))]" fill="none" stroke="currentColor" strokeWidth="0.5" preserveAspectRatio="none">
      <line x1="0" y1="0" x2="100%" y2="100%" />
    </svg>
  </div>
);
