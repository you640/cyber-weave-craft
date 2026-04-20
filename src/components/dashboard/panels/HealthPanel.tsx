import { useEffect, useState } from "react";
import { useVpsExec } from "@/hooks/use-vps-exec";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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

const parseHealth = (stdout: string): HealthMetrics => {
  const m: HealthMetrics = {
    cpuLoad: null, cpuPct: null,
    ramUsed: null, ramTotal: null, ramPct: null,
    diskUsed: null, diskTotal: null, diskPct: null,
    uptime: null,
  };
  // top "load average: 0.12, 0.34, 0.56"
  const load = stdout.match(/load average:\s*([0-9.]+)/i);
  if (load) m.cpuLoad = load[1];
  // top "%Cpu(s):  3.2 us"
  const cpu = stdout.match(/%Cpu\(s\):\s*([0-9.]+)\s*us/i);
  if (cpu) m.cpuPct = cpu[1];
  // top uptime line "up X days, HH:MM"
  const up = stdout.match(/up\s+([^,]+(?:,\s*[0-9:]+)?)/i);
  if (up) m.uptime = up[1].trim();
  // free -h "Mem:  total used free ..."
  const mem = stdout.match(/Mem:\s*(\S+)\s+(\S+)/i);
  if (mem) {
    m.ramTotal = mem[1];
    m.ramUsed = mem[2];
    const tot = parseSize(mem[1]);
    const used = parseSize(mem[2]);
    if (tot && used) m.ramPct = Math.round((used / tot) * 100);
  }
  // df -h /  → "/dev/...  total  used  avail  use%  /"
  const df = stdout.match(/\n\S+\s+(\S+)\s+(\S+)\s+\S+\s+(\d+)%\s+\/\s*$/m)
    ?? stdout.match(/(\S+)\s+(\S+)\s+\S+\s+(\d+)%\s+\/\s*$/m);
  if (df) {
    m.diskTotal = df[1];
    m.diskUsed = df[2];
    m.diskPct = parseInt(df[3], 10);
  }
  return m;
};

const parseSize = (s: string): number | null => {
  const m = s.match(/^([0-9.]+)\s*([KMGT]?i?)/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const u = m[2].toUpperCase();
  const mult: Record<string, number> = { "": 1, K: 1e3, KI: 1024, M: 1e6, MI: 1024 ** 2, G: 1e9, GI: 1024 ** 3, T: 1e12, TI: 1024 ** 4 };
  return n * (mult[u] ?? 1);
};

const Bar = ({ pct }: { pct: number | null }) => {
  const v = pct ?? 0;
  const color = v >= 85 ? "bg-destructive" : v >= 65 ? "bg-amber-500" : "bg-primary";
  return (
    <div className="h-1.5 w-full bg-[hsl(var(--wire-bg-soft))] wire-border">
      <div className={`h-full ${color} transition-all`} style={{ width: `${Math.min(v, 100)}%` }} />
    </div>
  );
};

const Metric = ({ label, value, sub, pct }: { label: string; value: string; sub?: string; pct?: number | null }) => (
  <div className="wire-border wire-shadow p-5 backdrop-blur-sm bg-background/60">
    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">{label}</div>
    <div className="font-mono text-3xl font-bold tracking-tight">{value}</div>
    {sub && <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">{sub}</div>}
    {pct !== undefined && <div className="mt-4"><Bar pct={pct ?? null} /></div>}
  </div>
);

export const HealthPanel = () => {
  const { data, error, loading, run } = useVpsExec();
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      run("nexify-health").then(() => setLastRefresh(new Date().toLocaleTimeString()));
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, [run]);

  const metrics = data?.stdout ? parseHealth(data.stdout) : null;

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">// HEALTH · 12</div>
        <h1 className="font-mono text-2xl mt-1">Vitalita systému</h1>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          194.182.87.6 · auto-refresh 10s · cmd: nexify-health
        </p>
      </div>

      <div className="wire-border wire-shadow p-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className={error ? "text-destructive" : loading ? "text-muted-foreground" : "text-primary"}>
            [ {error ? "ERROR" : loading ? "PROBING…" : "ONLINE"} ]
          </span>
          {lastRefresh && (
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              last · {lastRefresh}
            </span>
          )}
          {metrics?.uptime && (
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              up · {metrics.uptime}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => run("nexify-health").then(() => setLastRefresh(new Date().toLocaleTimeString()))}
          disabled={loading}
          className="font-mono text-[10px] tracking-[0.2em] uppercase"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          refresh
        </Button>
      </div>

      {error && (
        <div className="wire-border p-4 bg-destructive/10 font-mono text-xs text-destructive">
          [ ERROR ] {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Metric
          label="CPU LOAD (1m)"
          value={metrics?.cpuLoad ?? "—"}
          sub={metrics?.cpuPct ? `${metrics.cpuPct}% user` : undefined}
        />
        <Metric
          label="MEMORY"
          value={metrics?.ramUsed ?? "—"}
          sub={metrics?.ramTotal ? `of ${metrics.ramTotal}` : undefined}
          pct={metrics?.ramPct ?? null}
        />
        <Metric
          label="DISK /"
          value={metrics?.diskUsed ?? "—"}
          sub={metrics?.diskTotal ? `of ${metrics.diskTotal}` : undefined}
          pct={metrics?.diskPct ?? null}
        />
      </div>

      <div className="wire-border bg-background">
        <div className="px-4 py-2 border-b border-dashed border-border font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          // RAW OUTPUT
        </div>
        <pre className="p-4 font-mono text-[11px] text-muted-foreground whitespace-pre-wrap break-all max-h-72 overflow-auto">
          {data?.stdout || "# no data"}
          {data?.stderr && `\n\n[stderr]\n${data.stderr}`}
        </pre>
      </div>
    </div>
  );
};

export default HealthPanel;
