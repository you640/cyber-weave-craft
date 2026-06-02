import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  padded?: boolean;
}

export const SectionCard = ({
  title,
  eyebrow,
  actions,
  children,
  className,
  bodyClassName,
  padded = true,
}: SectionCardProps) => (
  <section className={cn("surface-card overflow-hidden", className)}>
    {(title || eyebrow || actions) && (
      <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[hsl(var(--border-subtle))]">
        <div className="min-w-0">
          {eyebrow && (
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              {eyebrow}
            </div>
          )}
          {title && <h3 className="text-sm font-medium text-foreground mt-0.5">{title}</h3>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </header>
    )}
    <div className={cn(padded ? "p-5" : "", bodyClassName)}>{children}</div>
  </section>
);
