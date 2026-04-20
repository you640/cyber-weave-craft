import { useEffect, useMemo, useState } from "react";
import { useVpsExec } from "@/hooks/use-vps-exec";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, FileJson, ExternalLink } from "lucide-react";

interface CveEntry {
  cve_id?: string;
  id?: string;
  cve?: string;
  cvss_score?: number;
  cvss?: number;
  score?: number;
  severity?: string;
  cwe?: string | string[];
  description?: string;
  summary?: string;
  url?: string;
}

interface ParsedReport {
  meta: Record<string, unknown>;
  vulns: CveEntry[];
}

const cvssBadge = (score: number | undefined) => {
  if (score === undefined || score === null || isNaN(score)) {
    return "border-border text-muted-foreground bg-background";
  }
  if (score >= 7) return "border-destructive text-destructive bg-destructive/10";
  if (score >= 4) return "border-amber-500 text-amber-500 bg-amber-500/10";
  return "border-primary text-primary bg-primary/10";
};

const extractVulns = (json: unknown): CveEntry[] => {
  if (!json || typeof json !== "object") return [];
  const obj = json as Record<string, unknown>;
  const candidates = ["vulnerabilities", "vulns", "cves", "findings", "issues", "results"];
  for (const k of candidates) {
    const v = obj[k];
    if (Array.isArray(v)) return v as CveEntry[];
  }
  // nested: scans[*].vulnerabilities
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (Array.isArray(v)) {
      const flat: CveEntry[] = [];
      for (const item of v) {
        if (item && typeof item === "object") {
          for (const inner of candidates) {
            const arr = (item as Record<string, unknown>)[inner];
            if (Array.isArray(arr)) flat.push(...(arr as CveEntry[]));
          }
        }
      }
      if (flat.length) return flat;
    }
  }
  return [];
};

const getId = (e: CveEntry) => e.cve_id || e.cve || e.id || "—";
const getScore = (e: CveEntry) => {
  const s = e.cvss_score ?? e.cvss ?? e.score;
  return typeof s === "number" ? s : typeof s === "string" ? parseFloat(s) : undefined;
};
const getCwe = (e: CveEntry) => Array.isArray(e.cwe) ? e.cwe.join(", ") : e.cwe || "—";
const getDesc = (e: CveEntry) => e.description || e.summary || "";

export const ReportsPanel = () => {
  const list = useVpsExec();
  const report = useVpsExec();
  const [selected, setSelected] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    list.run("nexify-list-reports");
    report.run("nexify-latest-report");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reports = useMemo(() => {
    if (!list.data?.stdout) return [];
    return list.data.stdout
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  }, [list.data]);

  const parsed: ParsedReport | null = useMemo(() => {
    if (!report.data?.stdout) return null;
    try {
      const json = JSON.parse(report.data.stdout);
      return { meta: json as Record<string, unknown>, vulns: extractVulns(json) };
    } catch {
      return null;
    }
  }, [report.data]);

  const refreshAll = () => {
    list.run("nexify-list-reports");
    report.run(selected ? `cat ${selected}` : "nexify-latest-report");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">// REPORTS · 14</div>
        <h1 className="font-mono text-2xl mt-1">Audit reporty · NVD CVE</h1>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          /home/wp-audit/reports/ · CVSS · CWE · vulnerability summary
        </p>
      </div>

      <div className="wire-border wire-shadow p-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-primary">[ {reports.length} REPORTS ]</span>
          {parsed && (
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              · {parsed.vulns.length} vulnerabilities found
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRaw((v) => !v)}
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
          >
            <FileJson className="h-3 w-3" />
            {showRaw ? "table" : "raw json"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshAll}
            disabled={list.loading || report.loading}
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
          >
            <RefreshCw className={`h-3 w-3 ${list.loading || report.loading ? "animate-spin" : ""}`} />
            refresh
          </Button>
        </div>
      </div>

      {(list.error || report.error) && (
        <div className="wire-border p-4 bg-destructive/10 font-mono text-xs text-destructive whitespace-pre-wrap">
          [ ERROR ] {list.error || report.error}
        </div>
      )}

      <div className="grid lg:grid-cols-[280px_1fr] gap-4">
        {/* Report list */}
        <div className="wire-border bg-background">
          <div className="px-4 py-2 border-b border-dashed border-border font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            // FILES
          </div>
          <div className="divide-y divide-dashed divide-border max-h-[600px] overflow-auto">
            {reports.length === 0 && (
              <div className="px-4 py-6 font-mono text-xs text-muted-foreground text-center">
                # no reports
              </div>
            )}
            {reports.map((path) => {
              const name = path.split("/").pop() ?? path;
              const active = selected === path || (!selected && reports[0] === path);
              return (
                <button
                  key={path}
                  onClick={() => {
                    setSelected(path);
                    report.run(`cat ${path}`);
                  }}
                  className={`w-full text-left px-4 py-2 font-mono text-[11px] hover:bg-[hsl(var(--wire-bg-soft))] transition-colors truncate ${
                    active ? "bg-[hsl(var(--wire-bg-soft))] text-primary" : "text-foreground"
                  }`}
                  title={path}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Viewer */}
        <div className="wire-border bg-background min-h-[400px]">
          <div className="px-4 py-2 border-b border-dashed border-border flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              // {showRaw ? "RAW JSON" : "VULNERABILITIES"}
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground truncate max-w-xs">
              {selected ? selected.split("/").pop() : "latest"}
            </span>
          </div>

          {showRaw ? (
            <pre className="p-4 font-mono text-[11px] text-muted-foreground whitespace-pre-wrap break-all max-h-[600px] overflow-auto">
              {report.data?.stdout || "# no data"}
            </pre>
          ) : !parsed ? (
            <div className="p-8 font-mono text-xs text-muted-foreground text-center">
              {report.loading ? "# loading…" : "# no JSON parsable / no vulnerabilities"}
            </div>
          ) : parsed.vulns.length === 0 ? (
            <div className="p-8 font-mono text-xs text-muted-foreground text-center">
              # no vulnerabilities in this report
            </div>
          ) : (
            <div className="overflow-auto max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-mono text-[10px] tracking-[0.2em] uppercase">CVE</TableHead>
                    <TableHead className="font-mono text-[10px] tracking-[0.2em] uppercase w-24">CVSS</TableHead>
                    <TableHead className="font-mono text-[10px] tracking-[0.2em] uppercase w-32">CWE</TableHead>
                    <TableHead className="font-mono text-[10px] tracking-[0.2em] uppercase">Description</TableHead>
                    <TableHead className="font-mono text-[10px] tracking-[0.2em] uppercase w-12">NVD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsed.vulns.map((v, i) => {
                    const id = getId(v);
                    const score = getScore(v);
                    return (
                      <TableRow key={`${id}-${i}`}>
                        <TableCell className="font-mono text-xs">{id}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center wire-border px-2 py-0.5 font-mono text-[10px] tracking-wider ${cvssBadge(score)}`}>
                            {score !== undefined ? score.toFixed(1) : "—"}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-muted-foreground">{getCwe(v)}</TableCell>
                        <TableCell className="font-mono text-[11px] max-w-md">
                          <div className="line-clamp-2">{getDesc(v) || "—"}</div>
                        </TableCell>
                        <TableCell>
                          {id && id !== "—" && id.startsWith("CVE-") && (
                            <a
                              href={`https://nvd.nist.gov/vuln/detail/${id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:opacity-70"
                              title="Open in NVD"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;
