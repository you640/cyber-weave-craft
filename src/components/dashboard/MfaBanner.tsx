import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

export const MfaBanner = () => {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (sessionStorage.getItem("mfa-banner-dismissed") === "1") {
      setDismissed(true);
      return;
    }
    supabase.auth.mfa.listFactors().then(({ data }) => {
      const hasVerified = data?.totp?.some((f) => f.status === "verified") ?? false;
      setShow(!hasVerified);
    });
  }, [user?.id]);

  if (!show || dismissed) return null;

  const dismiss = () => {
    sessionStorage.setItem("mfa-banner-dismissed", "1");
    setDismissed(true);
  };

  return (
    <div className="wire-border bg-[hsl(var(--wire-bg-soft))] border-l-4 border-l-primary px-5 py-4 flex items-start gap-4 flex-wrap">
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-1">
          // SECURITY ADVISORY
        </div>
        <div className="font-mono text-sm text-foreground mb-1">
          Two-factor authentication nie je aktivované
        </div>
        <div className="text-xs text-muted-foreground">
          Admin účet je chránený len heslom. Aktiváciou TOTP znížiš dopad kompromitácie hesla.
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          to="/dashboard/mfa"
          className="font-mono text-xs px-3 py-2 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          [ Aktivovať → ]
        </Link>
        <button
          onClick={dismiss}
          className="font-mono text-xs px-3 py-2 wire-border hover:bg-background transition-colors"
        >
          [ neskôr ]
        </button>
      </div>
    </div>
  );
};
