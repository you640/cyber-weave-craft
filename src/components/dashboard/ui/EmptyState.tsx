import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-12">
    {icon && (
      <div className="h-12 w-12 rounded-full surface-muted flex items-center justify-center text-muted-foreground mb-4">
        {icon}
      </div>
    )}
    <div className="text-sm font-medium text-foreground">{title}</div>
    {description && (
      <p className="text-xs text-muted-foreground mt-1.5 max-w-sm">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
