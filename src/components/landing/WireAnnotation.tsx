import { cn } from "@/lib/utils";

interface WireAnnotationProps {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
}

export const WireAnnotation = ({ children, className, rotate = -4 }: WireAnnotationProps) => (
  <span
    className={cn("font-hand text-2xl text-[hsl(var(--wire-handwritten))] inline-block", className)}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {children}
  </span>
);

export const WireArrow = ({ direction = "left", className }: { direction?: "left" | "right" | "down"; className?: string }) => {
  const rot = direction === "right" ? 180 : direction === "down" ? 90 : 0;
  return (
    <svg
      viewBox="0 0 80 30"
      className={cn("text-[hsl(var(--wire-handwritten))]", className)}
      style={{ transform: `rotate(${rot}deg)` }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M75 15 Q 50 5, 20 15" />
      <path d="M20 15 L 28 9" />
      <path d="M20 15 L 28 21" />
    </svg>
  );
};

export const SectionMarker = ({ num, label }: { num: string; label: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="font-mono text-xs text-muted-foreground tracking-[0.2em]">// {num} ·</span>
    <span className="font-mono text-xs text-foreground tracking-[0.2em] uppercase">{label}</span>
    <span className="flex-1 h-px border-t border-dashed border-[hsl(var(--wire-line))]" />
  </div>
);
