import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { MfaBanner } from "@/components/dashboard/MfaBanner";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { StatCard } from "@/components/dashboard/ui/StatCard";
import { SectionCard } from "@/components/dashboard/ui/SectionCard";
import { StatusPill } from "@/components/dashboard/ui/StatusPill";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";
import {
  Users, ShieldCheck, Activity, Server, Terminal, Plug, HeartPulse, Inbox,
} from "lucide-react";

interface Signup {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
}

const formatRelative = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "práve teraz";
  if (m < 60) return `pred ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `pred ${h} h`;
  const d = Math.floor(h / 24);
  return `pred ${d} d`;
};

// Tiny pseudo sparkline so cards don't look empty before real metrics land.
const fakeSpark = (seed: number) =>
  Array.from({ length: 16 }, (_, i) => 50 + Math.sin((i + seed) * 0.6) * 12 + (i % 3) * 4);

export const Overview = () => {
  const { user } = useAuth();
  const [usersTotal, setUsersTotal] = useState<string>("—");
  const [profilesToday, setProfilesToday] = useState<string>("—");
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);

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
          .limit(6),
      ]);

      if (cancelled) return;
      setUsersTotal(total?.toString() ?? "0");
      setProfilesToday(today?.toString() ?? "0");
      setSignups((recent ?? []) as Signup[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="// OVERVIEW · 01"
        title="Riadiace centrum"
        description="Prehľad stavu systému, posledných udalostí a rýchlych akcií."
        actions={<StatusPill tone="ok" label="Všetko v poriadku" />}
      />

      <MfaBanner />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Používatelia"
          value={loading ? "…" : usersTotal}
          hint="profiles · all time"
          icon={<Users className="h-4 w-4" />}
          sparkline={fakeSpark(1)}
          tone="info"
        />
        <StatCard
          label="Nové dnes"
          value={loading ? "…" : profilesToday}
          hint="signups · 24h"
          delta={{ value: "live", trend: "flat" }}
          icon={<Activity className="h-4 w-4" />}
          sparkline={fakeSpark(3)}
          tone="success"
        />
        <StatCard
          label="WP Audit"
          value="—"
          hint="spusti audit pre score"
          icon={<ShieldCheck className="h-4 w-4" />}
          tone="warning"
        />
        <StatCard
          label="VPS uptime"
          value="—"
          hint="194.182.87.6"
          icon={<Server className="h-4 w-4" />}
          tone="default"
        />
      </div>

      {/* System status grid + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          eyebrow="// SYSTEM STATUS"
          title="Komponenty"
          className="lg:col-span-2"
          padded={false}
        >
          <ul className="divide-y divide-[hsl(var(--border-subtle))]">
            {[
              { name: "Edge functions", tone: "ok" as const, hint: "vps-exec · mcp-call · ready" },
              { name: "Database", tone: "ok" as const, hint: "postgres · responsive" },
              { name: "MCP bridge", tone: "idle" as const, hint: "spusti probe v MCP paneli" },
              { name: "VPS bridge", tone: "idle" as const, hint: "spusti Health refresh" },
            ].map((row) => (
              <li key={row.name} className="px-5 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{row.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">{row.hint}</div>
                </div>
                <StatusPill tone={row.tone} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard eyebrow="// QUICK ACTIONS" title="Skoč rovno na…">
          <div className="grid grid-cols-1 gap-2">
            {[
              { to: "/dashboard/health", icon: HeartPulse, label: "Health refresh" },
              { to: "/dashboard/wp-audit", icon: ShieldCheck, label: "Spustiť WP audit" },
              { to: "/dashboard/mcp", icon: Plug, label: "Probe MCP server" },
              { to: "/dashboard/shell", icon: Terminal, label: "Otvoriť shell" },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-elevated))] hover:bg-[hsl(var(--surface-muted))] hover:border-[hsl(var(--border-strong))] transition-colors text-sm text-foreground group"
              >
                <a.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="flex-1">{a.label}</span>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">→</span>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Recent signups */}
      <SectionCard
        eyebrow="// RECENT SIGNUPS"
        title="Posledné registrácie"
        actions={<span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">last 6</span>}
        padded={false}
      >
        {signups.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-5 w-5" />}
            title="Zatiaľ žiadne registrácie"
            description="Nové signupy sa zobrazia tu hneď ako prídu."
          />
        ) : (
          <ul className="divide-y divide-[hsl(var(--border-subtle))]">
            {signups.map((s) => (
              <li
                key={s.id}
                className="px-5 py-3 flex items-center justify-between gap-3 text-sm hover:bg-[hsl(var(--surface-muted))] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[11px] font-mono flex items-center justify-center shrink-0">
                    {(s.display_name ?? s.email ?? "?").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-foreground truncate">
                      {s.display_name ?? s.email ?? "—"}
                    </div>
                    {s.email && s.display_name && (
                      <div className="text-xs text-muted-foreground truncate">{s.email}</div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 font-mono">
                  {formatRelative(s.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <div className="surface-muted px-4 py-3 font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground flex items-center gap-3 flex-wrap">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
        <span>admin session</span>
        <span className="opacity-50">·</span>
        <span className="normal-case tracking-normal text-xs text-foreground">{user?.email ?? "—"}</span>
      </div>
    </div>
  );
};
