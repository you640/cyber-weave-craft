import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionCard } from "@/components/dashboard/ui/SectionCard";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";
import { Activity, CheckCircle2, XCircle, Terminal } from "lucide-react";

type LogRow = {
  id: string;
  command: string;
  exit_code: number | null;
  created_at: string;
};

const relative = (iso: string) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "teraz";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

export const RecentActivity = () => {
  const [rows, setRows] = useState<LogRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("admin_command_log")
        .select("id,command,exit_code,created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      if (!cancelled) setRows((data ?? []) as LogRow[]);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <SectionCard
      eyebrow="// RECENT ACTIVITY"
      title="Posledné príkazy"
      actions={<span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">last 10</span>}
      padded={false}
    >
      {!rows ? (
        <ul className="divide-y divide-[hsl(var(--border-subtle))]">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="px-5 py-3 flex items-center gap-3 animate-pulse">
              <div className="h-6 w-6 rounded-full bg-[hsl(var(--surface-muted))]" />
              <div className="h-3 w-40 rounded bg-[hsl(var(--surface-muted))]" />
              <div className="ml-auto h-3 w-10 rounded bg-[hsl(var(--surface-muted))]" />
            </li>
          ))}
        </ul>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-5 w-5" />}
          title="Žiadna aktivita"
          description="Spusti shell alebo health príkaz a objaví sa tu."
        />
      ) : (
        <ul className="divide-y divide-[hsl(var(--border-subtle))]">
          {rows.map((r) => {
            const ok = r.exit_code === 0;
            const Icon = ok ? CheckCircle2 : r.exit_code === null ? Terminal : XCircle;
            return (
              <li key={r.id} className="px-5 py-3 flex items-center gap-3 text-sm hover:bg-[hsl(var(--surface-muted))] transition-colors">
                <Icon className={`h-4 w-4 shrink-0 ${ok ? "text-success" : r.exit_code === null ? "text-muted-foreground" : "text-destructive"}`} />
                <span className="font-mono text-xs text-foreground truncate flex-1">{r.command}</span>
                <span className={`text-[10px] font-mono tracking-[0.15em] uppercase shrink-0 ${ok ? "text-success" : "text-destructive"}`}>
                  [{r.exit_code ?? "?"}]
                </span>
                <span className="text-[11px] font-mono text-muted-foreground shrink-0 w-10 text-right">
                  {relative(r.created_at)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
};
