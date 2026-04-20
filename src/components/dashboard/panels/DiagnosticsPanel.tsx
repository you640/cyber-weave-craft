import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StepResult {
  step: string;
  ok: boolean;
  status?: number;
  duration_ms: number;
  response_preview?: string;
  error?: string;
  hint?: string;
}

interface DiagnosticsResult {
  config: Record<string, string>;
  derived?: { healthUrl: string; execUrl: string };
  steps: StepResult[];
  recommendation?: string;
  fatal?: string;
}

export const DiagnosticsPanel = () => {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<DiagnosticsResult | null>(null);

  const run = async () => {
    setBusy(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("vps-diagnose");
      if (error) {
        toast.error("Diagnostika zlyhala", { description: error.message });
        setBusy(false);
        return;
      }
      setResult(data as DiagnosticsResult);
    } catch (e) {
      toast.error("Niečo sa pokazilo", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
          // CONTROL · 13 · BRIDGE DIAGNOSTICS
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Bridge connection probe<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Otestuje VPS bridge z edge funkcie (server-side). Secrety nikdy neopustia backend.
        </p>
      </div>

      <button
        onClick={run}
        disabled={busy}
        className="font-mono text-sm px-5 py-3 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
      >
        {busy ? "[ ... probing ... ]" : "[ ▶ RUN DIAGNOSTICS ]"}
      </button>

      {result && (
        <div className="space-y-4">
          {/* All systems operational banner */}
          {!result.fatal && result.steps.length > 0 && result.steps.every((s) => s.ok) && (
            <div className="wire-border bg-primary/10 border-primary p-4 flex items-center gap-3">
              <span className="font-mono text-primary text-lg">●</span>
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary">
                  // STATUS · OK
                </div>
                <div className="font-mono text-sm font-semibold text-primary mt-1">
                  ALL SYSTEMS OPERATIONAL
                </div>
              </div>
            </div>
          )}

          {/* System degraded banner */}
          {!result.fatal && result.steps.length > 0 && result.steps.some((s) => !s.ok) && (
            <div className="wire-border bg-destructive/10 border-destructive p-4 flex items-center gap-3">
              <span className="font-mono text-destructive text-lg animate-pulse">●</span>
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-destructive">
                  // STATUS · DEGRADED
                </div>
                <div className="font-mono text-sm font-semibold text-destructive mt-1">
                  SYSTEM DEGRADED · {result.steps.filter((s) => !s.ok).length}/{result.steps.length} CHECKS FAILED
                </div>
              </div>
            </div>
          )}

          {/* Config block */}
          <section className="wire-border bg-background/60 backdrop-blur-sm p-4">
            <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-3">
              FIG_13A · edge function secrets
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
              {Object.entries(result.config).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 py-1 border-b border-dashed border-border">
                  <span className="text-muted-foreground">{k}</span>
                  <span className={v.startsWith("✓") ? "text-primary" : v.startsWith("✗") ? "text-destructive" : "text-foreground"}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
            {result.derived && (
              <div className="mt-3 pt-3 border-t border-dashed border-border font-mono text-[11px] space-y-1">
                <div><span className="text-muted-foreground">health URL: </span>{result.derived.healthUrl}</div>
                <div><span className="text-muted-foreground">exec URL: </span>{result.derived.execUrl}</div>
              </div>
            )}
          </section>

          {/* Fatal */}
          {result.fatal && (
            <div className="wire-border border-destructive bg-destructive/10 p-4 font-mono text-xs text-destructive">
              FATAL: {result.fatal}
            </div>
          )}

          {/* Steps */}
          {result.steps.map((s, i) => (
            <section
              key={i}
              className={`wire-border p-4 ${s.ok ? "bg-background/60" : "border-destructive bg-destructive/5"} backdrop-blur-sm`}
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <div className="font-mono text-xs font-semibold">
                  [{i + 1}] {s.step}
                </div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase">
                  {s.ok ? <span className="text-primary">PASS</span> : <span className="text-destructive">FAIL</span>}
                  {s.status !== undefined && <span className="text-muted-foreground"> · HTTP {s.status}</span>}
                  <span className="text-muted-foreground"> · {s.duration_ms}ms</span>
                </div>
              </div>
              {s.error && (
                <div className="font-mono text-[11px] text-destructive mb-2">
                  ERROR: {s.error}
                </div>
              )}
              {s.hint && (
                <div className="font-mono text-[11px] text-muted-foreground mb-2 italic">
                  → {s.hint}
                </div>
              )}
              {s.response_preview && (
                <pre className="font-mono text-[11px] bg-muted/50 p-3 wire-border overflow-x-auto whitespace-pre-wrap break-words">
                  {s.response_preview}
                </pre>
              )}
            </section>
          ))}

          {/* Recommendation */}
          {result.recommendation && (
            <div className="wire-border bg-[hsl(var(--wire-bg-soft))] p-4">
              <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
                // RECOMMENDATION
              </div>
              <div className="font-mono text-xs">{result.recommendation}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
