import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ eyebrow, title, description, actions }: PageHeaderProps) => (
  <header className="flex items-start justify-between gap-4 flex-wrap pb-6 border-b border-[hsl(var(--border-subtle))]">
    <div className="min-w-0">
      {eyebrow && (
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
          {eyebrow}
        </div>
      )}
      <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{description}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </header>
);
