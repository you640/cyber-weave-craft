import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useAuth } from "./AuthProvider";

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useIsAdmin();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background wire-dots flex items-center justify-center">
        <div className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground wire-border px-6 py-4">
          [ AUTH · CHECKING CLEARANCE ... ]
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};
