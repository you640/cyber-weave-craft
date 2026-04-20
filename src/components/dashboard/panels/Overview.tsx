import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { MfaBanner } from "@/components/dashboard/MfaBanner";

interface Signup {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
}

const formatRelative = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

const Kpi = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="wire-border wire-shadow p-5 bg-background">
    <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground">
      {label}
    </div>
    <div className="font-mono text-4xl mt-3 text-foreground">{value}</div>
    {hint && (
      <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground mt-2">
        {hint}
      </div>
    )}
  </div>
);

export const Overview = () => {
  const { user } = useAuth();
  const [usersTotal, setUsersTotal] = useState<string>("—");
  const [profilesToday, setProfilesToday] = useState<string>("—");
  const [signups, setSignups] = useState<Signup[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const [{ count: total }, { count: today }, { data: recent }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfDay.toISOString()),
        supabase
          .from("profiles")
          .select("id, email, display_name, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (cancelled) return;
      setUsersTotal(total?.toString() ?? "0");
      setProfilesToday(today?.toString() ?? "0");
      setSignups((recent ?? []) as Signup[]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          // OVERVIEW · 01
        </div>
        <h1 className="font-mono text-2xl md:text-3xl mt-2 text-foreground">
          Riadiace centrum
        </h1>
        <div className="border-t border-dashed border-border mt-4" />
      </div>

      <MfaBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Používatelia spolu" value={usersTotal} hint="profiles · all time" />
        <Kpi label="Profily dnes" value={profilesToday} hint="signups · 24h" />
        <Kpi label="Útoky zablokované" value="—" hint="bridge offline" />
        <Kpi label="VPS uptime" value="—" hint="194.182.87.6" />
      </div>

      <div className="wire-border wire-shadow bg-background">
        <div className="px-5 py-3 border-b border-dashed border-border flex items-center justify-between">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            // RECENT SIGNUPS
          </div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
            last 5
          </div>
        </div>
        {signups.length === 0 ? (
          <div className="p-6 font-mono text-xs text-muted-foreground">
            [ no signups yet ]
          </div>
        ) : (
          <ul className="divide-y divide-dashed divide-border">
            {signups.map((s) => (
              <li
                key={s.id}
                className="px-5 py-3 flex items-center justify-between font-mono text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-primary">›</span>
                  <span className="truncate text-foreground">
                    {s.display_name ?? s.email ?? "—"}
                  </span>
                  {s.email && s.display_name && (
                    <span className="text-muted-foreground truncate hidden md:inline">
                      {s.email}
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground tracking-[0.15em] text-[10px] uppercase">
                  {formatRelative(s.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="wire-border bg-[hsl(var(--wire-bg-soft))] px-4 py-3 font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground flex items-center gap-3 flex-wrap">
        <span className="text-primary">●</span>
        <span>admin</span>
        <span className="opacity-50">·</span>
        <span className="normal-case tracking-normal text-xs text-foreground">
          {user?.email ?? "—"}
        </span>
        <span className="opacity-50">·</span>
        <span>session aktívna</span>
      </div>
    </div>
  );
};
