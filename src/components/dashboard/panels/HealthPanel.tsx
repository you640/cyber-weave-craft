import { useEffect, useState } from "react";
import { useVpsExec } from "@/hooks/use-vps-exec";
import { Button } from "@/components/ui/button";
import { RefreshCw, LogIn } from "lucide-react";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { SectionCard } from "@/components/dashboard/ui/SectionCard";
import { StatusPill, StatusTone } from "@/components/dashboard/ui/StatusPill";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";
import { cn } from "@/lib/utils";

interface HealthMetrics {
  cpuLoad: string | null;
  cpuPct: string | null;
  ramUsed: string | null;
  ramTotal: string | null;
  ramPct: number | null;
  diskUsed: string | null;
  diskTotal: string | null;
  diskPct: number | null;
  uptime: string | null;
}

const parseSize = (s: string): number | null => {
  const m = s.match(/^([0-9.]+)\s*([KMGT]?i?)/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const u = m[2].toUpperCase();
  const mult: Record<string, number> = { "": 1, K: 1e3, KI: 1024, M: 1e6, MI: 1024 ** 2, G: 1e9, GI: 1024 ** 3, T: 1e12, TI: 1024 ** 4 };
  return n * (mult[u] ?? 1);
};

const parseHealth = (stdout: string): HealthMetrics => {
  const m: HealthMetrics = {
    cpuLoad: null, cpuPct: null,
    ramUsed: null, ramTotal: null, ramPct: null,
    diskUsed: null, diskTotal: null, diskPct: null,
    uptime: null,
  };
  const load = stdout.match(/load average:\s*([0-9.]+)/i);
  if (load) m.cpuLoad = load[1];
  const cpu = stdout.match(/%Cpu\(s\):\s*([0-9.]+)\s*us/i);
  if (cpu) m.cpuPct = cpu[1];
  const up = stdout.match(/up\s+([^,]+(?:,\s*[0-9:]+)?)/i);
  if (up) m.uptime = up[1].trim();
  const mem = stdout.match(/Mem:\s*(\S+)\s+(\S+)/i);
  if (mem) {
    m.ramTotal = mem[1];
    m.ramUsed = mem[2];
    const tot = parseSize(mem[1]);
    const used = parseSize(mem[2]);
    if (tot && used) m.ramPct = Math.round((used / tot) * 100);
  }
  const df = stdout.match(/\n\S+\s+(\S+)\s+(\S+)\s+\S+\s+(\d+)%\s+\/\s*$/m)
    ?? stdout.match(/(\S+)\s+(\S+)\s+\S+\s+(\d+)%\s+\/\s*$/m);
  if (df) {
    m.diskTotal = df[1];
    m.diskUsed = df[2];
    m.diskPct = parseInt(df[3], 10);
  }
  return m;
};

const ProgressBar = ({ pct }: { pct: number | null }) => {
  const v = pct ?? 0;
  const color = v >= 85 ? "bg-danger" : v >= 65 ? "bg-warning" : "bg-success";
  return (
    <div className="h-1.5 w-full rounded-full bg-[hsl(var(--surface-muted))] overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.min(v, 100)}%` }} />
    </div>
  );
};

const MetricCard = ({
  label, value, sub, pct, tone = "default",
}: {
  label: string; value: string; sub?: string; pct?: number | null;
  tone?: "default" | "success" | "warning" | "danger";
}) => (
  <div className="surface-card hover-lift p-5">
    <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
      {label}
    </div>
    <div className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">{value}</div>
    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    {pct !== undefined && <div className="mt-4"><ProgressBar pct={pct ?? null} /></div>}
  </div>
);

export const HealthPanel = () => {
  const { data, error, loading, run } = useVpsExec();
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      run("nexify-health").then(() => setLastRefresh(new Date().toLocaleTimeString()));
    };
    tick();
    const id = setInterval(tick, 30000);
    const onVis = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [run]);

  const metrics = data?.stdout ? parseHealth(data.stdout) : null;

  const tone: StatusTone = error
    ? error === "NOT_AUTHENTICATED" ? "warn" : "err"
    : loading && !data ? "loading"
    : data ? "ok"
    : "idle";

  const toneLabel = error
    ? error === "NOT_AUTHENTICATED" ? "AUTH" : "ERROR"
    : loading && !data ? "PROBING"
    : data ? "ONLINE"
    : "IDLE";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="// HEALTH · 12"
        title="Vitalita systému"
        description="194.182.87.6 · auto-refresh 10s · cmd: nexify-health"
        actions={
          <>
            <StatusPill tone={tone} label={toneLabel} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => run("nexify-health").then(() => setLastRefresh(new Date().toLocaleTimeString()))}
              disabled={loading}
              className="h-8"
            >
              <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", loading && "animate-spin")} />
              Refresh
            </Button>
          </>
        }
      />

      {error === "NOT_AUTHENTICATED" ? (
        <SectionCard padded={false}>
          <EmptyState
            icon={<LogIn className="h-5 w-5" />}
            title="Nie si prihlásený"
            description="Pre prístup k VPS health endpointu sa musíš prihlásiť znova."
            action={
              <a
                href="/auth"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Prihlásiť sa →
              </a>
            }
          />
        </SectionCard>
      ) : error ? (
        <div className="surface-card border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase mr-2">[ ERROR ]</span>
          {error}
        </div>
      ) : null}

      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
        {lastRefresh && <span>last refresh · {lastRefresh}</span>}
        {metrics?.uptime && (
          <>
            <span className="opacity-50">·</span>
            <span>uptime · {metrics.uptime}</span>
          </>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="CPU load (1m)"
          value={metrics?.cpuLoad ?? "—"}
          sub={metrics?.cpuPct ? `${metrics.cpuPct}% user` : undefined}
        />
        <MetricCard
          label="Memory"
          value={metrics?.ramUsed ?? "—"}
          sub={metrics?.ramTotal ? `of ${metrics.ramTotal}` : undefined}
          pct={metrics?.ramPct ?? null}
        />
        <MetricCard
          label="Disk /"
          value={metrics?.diskUsed ?? "—"}
          sub={metrics?.diskTotal ? `of ${metrics.diskTotal}` : undefined}
          pct={metrics?.diskPct ?? null}
        />
      </div>

      <SectionCard eyebrow="// RAW OUTPUT" title="nexify-health" padded={false}>
        <pre className="p-4 font-mono text-[11px] text-muted-foreground whitespace-pre-wrap break-all max-h-72 overflow-auto bg-[hsl(var(--surface-muted))]">
          {data?.stdout || "# no data yet"}
          {data?.stderr && `\n\n[stderr]\n${data.stderr}`}
        </pre>
      </SectionCard>
    </div>
  );
};

export default HealthPanel;
