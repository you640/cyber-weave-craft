import { useEffect, useRef, useState, useCallback, KeyboardEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, RefreshCw, Trash2, Download } from "lucide-react";

type Status = "probing" | "online" | "not_configured" | "error";

type HistoryEntry = {
  command: string;
  exit_code: number;
  stdout: string;
  stderr: string;
  duration_ms: number;
  blocked?: string;
  timestamp: number;
};

type RecentLogRow = {
  id: string;
  command: string;
  exit_code: number | null;
  created_at: string;
};

const QUICK_ACTIONS = ["uptime", "df -h", "free -h", "systemctl status caddy", "docker ps"];

const ALLOWLIST = [
  "uptime", "whoami", "hostname", "date", "df", "free", "uname",
  "systemctl status …", "systemctl is-active …", "journalctl --no-pager …",
  "ps aux", "top -bn1", "ss -tulpn", "netstat -tulpn",
  "ls", "cat", "tail", "head", "grep", "wc",
  "docker ps", "docker logs …", "docker stats …",
  "ufw status", "who", "w", "id",
];

export const McpPanelHeader = () => null; // unused

export const ShellPanel = () => {
  const [status, setStatus] = useState<Status>("probing");
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [recent, setRecent] = useState<RecentLogRow[]>([]);
  const cmdHistoryRef = useRef<string[]>([]);
  const cmdHistoryIdxRef = useRef<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadRecent = useCallback(async () => {
    const { data, error } = await supabase
      .from("admin_command_log")
      .select("id,command,exit_code,created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (!error && data) setRecent(data as RecentLogRow[]);
  }, []);

  const exec = useCallback(
    async (cmd: string, isProbe = false) => {
      const command = cmd.trim();
      if (!command) return;

      if (!isProbe) {
        setPending(true);
        cmdHistoryRef.current = [command, ...cmdHistoryRef.current.filter((c) => c !== command)].slice(0, 50);
        cmdHistoryIdxRef.current = -1;
      }

      try {
        const { data, error } = await supabase.functions.invoke("vps-exec", {
          body: { command },
        });

        if (error) {
          // supabase-js wraps non-2xx; try to read context
          const ctx = (error as { context?: Response }).context;
          let parsed: { error?: string; reason?: string } = {};
          let statusCode = 0;
          if (ctx) {
            statusCode = ctx.status;
            try {
              parsed = await ctx.clone().json();
            } catch {
              /* ignore */
            }
          }

          if (statusCode === 503 || parsed.error === "BRIDGE_NOT_CONFIGURED") {
            setStatus("not_configured");
            if (!isProbe) {
              setHistory((h) => [
                ...h,
                {
                  command,
                  exit_code: -1,
                  stdout: "",
                  stderr: "[ BRIDGE NOT CONFIGURED · doplň VPS_BRIDGE_URL a VPS_SHARED_SECRET ]",
                  duration_ms: 0,
                  timestamp: Date.now(),
                },
              ]);
            }
            return;
          }

          if (statusCode === 400 && parsed.error === "BLOCKED") {
            setHistory((h) => [
              ...h,
              {
                command,
                exit_code: -1,
                stdout: "",
                stderr: `[ BLOCKED · ${parsed.reason ?? "príkaz nie je v allowliste"} ]`,
                duration_ms: 0,
                blocked: parsed.reason,
                timestamp: Date.now(),
              },
            ]);
            return;
          }

          if (statusCode === 401 || statusCode === 403) {
            setStatus("error");
            setHistory((h) => [
              ...h,
              {
                command,
                exit_code: -1,
                stdout: "",
                stderr: `[ ${statusCode === 401 ? "UNAUTHORIZED" : "FORBIDDEN"} ]`,
                duration_ms: 0,
                timestamp: Date.now(),
              },
            ]);
            return;
          }

          setStatus("error");
          if (!isProbe) {
            setHistory((h) => [
              ...h,
              {
                command,
                exit_code: -1,
                stdout: "",
                stderr: `[ ERROR · ${error.message || "request failed"} ]`,
                duration_ms: 0,
                timestamp: Date.now(),
              },
            ]);
          }
          return;
        }

        const result = data as {
          exit_code: number;
          stdout: string;
          stderr: string;
          duration_ms: number;
        };

        setStatus("online");
        setLastSeen(new Date().toLocaleTimeString());

        if (!isProbe) {
          setHistory((h) => [
            ...h,
            {
              command,
              exit_code: result.exit_code,
              stdout: result.stdout || "",
              stderr: result.stderr || "",
              duration_ms: result.duration_ms || 0,
              timestamp: Date.now(),
            },
          ]);
        }
      } catch (e) {
        setStatus("error");
        const msg = e instanceof Error ? e.message : "unknown";
        if (!isProbe) {
          setHistory((h) => [
            ...h,
            {
              command,
              exit_code: -1,
              stdout: "",
              stderr: `[ ERROR · ${msg} ]`,
              duration_ms: 0,
              timestamp: Date.now(),
            },
          ]);
        }
      } finally {
        if (!isProbe) {
          setPending(false);
          loadRecent();
        }
      }
    },
    [loadRecent],
  );

  // Initial probe + recent
  useEffect(() => {
    exec("whoami", true);
    loadRecent();
  }, [exec, loadRecent]);

  // Auto-scroll terminal
  useEffect(() => {
    const el = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement | null;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const clearOutput = useCallback(() => setHistory([]), []);

  const downloadOutput = useCallback(() => {
    const txt = history
      .map((h) => `$ ${h.command}\n${h.stdout}${h.stderr ? `\n[stderr]\n${h.stderr}` : ""}\n# exit ${h.exit_code} · ${h.duration_ms}ms\n`)
      .join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shell-session-${new Date().toISOString().replace(/[:.]/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [history]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      clearOutput();
      return;
    }
    if (e.key === "Enter" && !pending) {
      e.preventDefault();
      const cmd = input;
      setInput("");
      exec(cmd);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cmdHistoryIdxRef.current + 1, cmdHistoryRef.current.length - 1);
      cmdHistoryIdxRef.current = next;
      if (next >= 0) setInput(cmdHistoryRef.current[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(cmdHistoryIdxRef.current - 1, -1);
      cmdHistoryIdxRef.current = next;
      setInput(next === -1 ? "" : cmdHistoryRef.current[next] ?? "");
    }
  };

  const statusLabel =
    status === "online"
      ? "[ ONLINE ]"
      : status === "probing"
        ? "[ PROBING… ]"
        : status === "not_configured"
          ? "[ NOT CONFIGURED ]"
          : "[ ERROR ]";

  const statusColor =
    status === "online"
      ? "text-primary"
      : status === "not_configured"
        ? "text-muted-foreground"
        : status === "error"
          ? "text-destructive"
          : "text-muted-foreground";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          // SHELL · 03
        </div>
        <h1 className="font-mono text-2xl mt-1">Vzdialený terminál</h1>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          194.182.87.6 · proxy cez vps-exec edge funkciu
        </p>
      </div>

      {/* Status bar */}
      <div className="wire-border wire-shadow p-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-3">
          <span className={`font-mono text-xs ${statusColor}`}>{statusLabel}</span>
          {lastSeen && (
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              last seen · {lastSeen}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setStatus("probing");
            exec("whoami", true);
          }}
          className="font-mono text-[10px] tracking-[0.2em] uppercase"
        >
          <RefreshCw className="h-3 w-3" />
          re-probe
        </Button>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((q) => (
          <button
            key={q}
            disabled={pending}
            onClick={() => {
              setInput(q);
              exec(q);
            }}
            className="font-mono text-[10px] tracking-[0.15em] uppercase wire-border px-3 py-1.5 hover:bg-[hsl(var(--wire-bg-soft))] transition-colors disabled:opacity-40"
          >
            $ {q}
          </button>
        ))}
      </div>

      {/* Terminal */}
      <div className="wire-border wire-shadow bg-[hsl(var(--wire-bg-soft))]">
        <div className="px-4 py-2 border-b border-dashed border-border flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            // TERMINAL
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadOutput}
              disabled={history.length === 0}
              title="Download session"
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center gap-1"
            >
              <Download className="h-3 w-3" /> save
            </button>
            <button
              onClick={clearOutput}
              disabled={history.length === 0}
              title="Clear (Ctrl+L)"
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" /> clear
            </button>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              tapfast@vps
            </span>
          </div>
        </div>


        <ScrollArea className="h-[420px]" ref={scrollRef}>
          <div className="p-4 font-mono text-xs space-y-3">
            {history.length === 0 && (
              <div className="text-muted-foreground">
                # zadaj príkaz alebo klikni quick action…
              </div>
            )}
            {history.map((entry, i) => (
              <div key={i} className="space-y-1">
                <div className="text-primary">
                  tapfast@vps:~$ <span className="text-foreground">{entry.command}</span>
                </div>
                {entry.stdout && (
                  <pre className="text-foreground whitespace-pre-wrap break-all">{entry.stdout}</pre>
                )}
                {entry.stderr && (
                  <pre className="text-destructive whitespace-pre-wrap break-all">{entry.stderr}</pre>
                )}
                <div className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                  exit {entry.exit_code} · {entry.duration_ms}ms
                </div>
              </div>
            ))}
            {pending && (
              <div className="text-muted-foreground animate-pulse">…executing</div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-dashed border-border px-4 py-2 flex items-center gap-2">
          <span className="font-mono text-xs text-primary">$</span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={pending}
            placeholder="uptime"
            className="font-mono text-xs border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-8"
            autoFocus
          />
        </div>
      </div>

      {/* Allowlist */}
      <Collapsible>
        <div className="wire-border bg-background">
          <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-[hsl(var(--wire-bg-soft))] transition-colors">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              // POLICY · ALLOWLIST
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 py-3 border-t border-dashed border-border grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
              {ALLOWLIST.map((c) => (
                <div key={c}>· {c}</div>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Recent commands */}
      <div className="wire-border bg-background">
        <div className="px-4 py-3 border-b border-dashed border-border flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            // AUDIT · LAST 10
          </span>
          <button
            onClick={loadRecent}
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
          >
            refresh
          </button>
        </div>
        <div className="divide-y divide-dashed divide-border">
          {recent.length === 0 && (
            <div className="px-4 py-6 font-mono text-xs text-muted-foreground text-center">
              # žiadne záznamy
            </div>
          )}
          {recent.map((r) => (
            <div key={r.id} className="px-4 py-2 flex items-center gap-3 font-mono text-xs">
              <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground w-20 shrink-0">
                {new Date(r.created_at).toLocaleTimeString()}
              </span>
              <span
                className={`text-[10px] tracking-[0.15em] uppercase w-12 shrink-0 ${
                  r.exit_code === 0 ? "text-primary" : "text-destructive"
                }`}
              >
                [{r.exit_code ?? "?"}]
              </span>
              <span className="truncate">{r.command}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShellPanel;
