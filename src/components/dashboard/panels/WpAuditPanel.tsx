import { useEffect, useState, useCallback } from "react";
import { useVpsExec } from "@/hooks/use-vps-exec";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const WpAuditPanel = () => {
  const starter = useVpsExec();
  const status = useVpsExec();
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    await status.run("nexify-wp-audit-status");
    setLastRefresh(new Date().toLocaleTimeString());
  }, [status]);

  useEffect(() => {
    refreshStatus();
    const id = setInterval(refreshStatus, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = async () => {
    const r = await starter.run("nexify-wp-audit-start");
    if (r && r.exit_code === 0) {
      toast.success("WP Audit · scan triggered", { description: "systemctl start wp-audit.service" });
      refreshStatus();
    } else {
      toast.error("WP Audit · failed to start", { description: r?.stderr || starter.error || "unknown" });
    }
  };

  const isActive = status.data?.stdout?.toLowerCase().includes("active");
  const isFailed = status.data?.stdout?.toLowerCase().includes("failed");

  const pillColor = isActive
    ? "text-primary border-primary"
    : isFailed
      ? "text-destructive border-destructive"
      : "text-muted-foreground border-border";

  const pillLabel = isActive ? "ACTIVE" : isFailed ? "FAILED" : status.loading ? "PROBING…" : "IDLE";

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">// WP AUDIT · 13</div>
        <h1 className="font-mono text-2xl mt-1">Enterprise WordPress sken</h1>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          wp-audit.service · NVD · CVSS · CWE · status refresh 5s
        </p>
      </div>

      <div className="wire-border wire-shadow p-6 bg-background backdrop-blur-sm bg-background/60">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
              SERVICE STATUS
            </div>
            <div className={`inline-flex items-center gap-2 wire-border px-3 py-1.5 font-mono text-xs tracking-[0.2em] uppercase ${pillColor}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-primary animate-pulse" : isFailed ? "bg-destructive" : "bg-muted-foreground"}`} />
              [ {pillLabel} ]
            </div>
            {lastRefresh && (
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-2">
                last · {lastRefresh}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshStatus}
              disabled={status.loading}
              className="font-mono text-[10px] tracking-[0.2em] uppercase"
            >
              <RefreshCw className={`h-3 w-3 ${status.loading ? "animate-spin" : ""}`} />
              refresh
            </Button>
            <Button
              onClick={handleStart}
              disabled={starter.loading || isActive}
              className="font-mono text-[10px] tracking-[0.25em] uppercase"
            >
              <Play className="h-3 w-3" />
              {starter.loading ? "starting…" : "run enterprise audit"}
            </Button>
          </div>
        </div>
      </div>

      {(starter.error || status.error) && (
        <div className="wire-border p-4 bg-destructive/10 font-mono text-xs text-destructive whitespace-pre-wrap">
          [ ERROR ] {starter.error || status.error}
        </div>
      )}

      <div className="wire-border bg-background">
        <div className="px-4 py-2 border-b border-dashed border-border font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          // STATUS · JOURNAL
        </div>
        <pre className="p-4 font-mono text-[11px] text-muted-foreground whitespace-pre-wrap break-all max-h-96 overflow-auto">
          {status.data?.stdout || "# no status data"}
          {status.data?.stderr && `\n\n[stderr]\n${status.data.stderr}`}
        </pre>
      </div>

      {starter.data && (
        <div className="wire-border bg-background">
          <div className="px-4 py-2 border-b border-dashed border-border font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            // LAST START · OUTPUT
          </div>
          <pre className="p-4 font-mono text-[11px] whitespace-pre-wrap break-all max-h-48 overflow-auto">
            {starter.data.stdout || "# (no stdout)"}
            {starter.data.stderr && `\n\n[stderr]\n${starter.data.stderr}`}
            {`\n\nexit ${starter.data.exit_code} · ${starter.data.duration_ms}ms`}
          </pre>
        </div>
      )}
    </div>
  );
};

export default WpAuditPanel;
