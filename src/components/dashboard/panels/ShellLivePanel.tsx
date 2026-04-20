import { useEffect, useRef, useState, useCallback, KeyboardEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

type Status = "probing" | "online" | "not_configured" | "error" | "unauthorized";

type HistoryEntry = {
  command: string;
  exit_code: number;
  stdout: string;
  stderr: string;
  duration_ms: number;
  timestamp: number;
};

const QUICK_ACTIONS = [
  "uname -a",
  "ls -la /var/log",
  "tail -n 50 /var/log/syslog",
  "systemctl list-units --failed",
  "docker ps -a",
];

export const ShellLivePanel = () => {
  const [status, setStatus] = useState<Status>("probing");
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const cmdHistoryRef = useRef<string[]>([]);
  const cmdHistoryIdxRef = useRef<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const exec = useCallback(async (cmd: string, isProbe = false) => {
    const command = cmd.trim();
    if (!command) return;

    if (!isProbe) {
      setPending(true);
      cmdHistoryRef.current = [command, ...cmdHistoryRef.current.filter((c) => c !== command)].slice(0, 50);
      cmdHistoryIdxRef.current = -1;
    }

    try {
      const { data, error } = await supabase.functions.invoke("vps-exec-live", {
        body: { command },
      });

      if (error) {
        const ctx = (error as { context?: Response }).context;
        let parsed: { error?: string; reason?: string; message?: string } = {};
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
          if (!isProbe) appendErr(command, "[ BRIDGE NOT CONFIGURED ]");
          return;
        }
        if (statusCode === 401) {
          setStatus("unauthorized");
          if (!isProbe) appendErr(command, "[ UNAUTHORIZED · prihlás sa znova ]");
          return;
        }
        if (statusCode === 403) {
          setStatus("unauthorized");
          if (!isProbe) appendErr(command, "[ FORBIDDEN · admin only ]");
          return;
        }
        if (statusCode === 502 || parsed.error === "UPSTREAM_UNREACHABLE") {
          setStatus("error");
          if (!isProbe) appendErr(command, `[ UPSTREAM UNREACHABLE · ${parsed.message ?? "relay down"} ]`);
          return;
        }
        if (statusCode === 400 && parsed.error === "BLOCKED") {
          if (!isProbe) appendErr(command, `[ BLOCKED · ${parsed.reason ?? "policy"} ]`);
          return;
        }

        setStatus("error");
        if (!isProbe) appendErr(command, `[ ERROR · ${error.message || "request failed"} ]`);
        return;
      }

      const result = data as { exit_code: number; stdout: string; stderr: string; duration_ms: number };
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
      if (!isProbe) appendErr(command, `[ ERROR · ${msg} ]`);
    } finally {
      if (!isProbe) setPending(false);
    }
  }, []);

  const appendErr = (command: string, stderr: string) => {
    setHistory((h) => [
      ...h,
      { command, exit_code: -1, stdout: "", stderr, duration_ms: 0, timestamp: Date.now() },
    ]);
  };

  useEffect(() => {
    exec("whoami", true);
  }, [exec]);

  useEffect(() => {
    const el = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement | null;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
    status === "online" ? "[ ONLINE · LIVE ]"
    : status === "probing" ? "[ PROBING… ]"
    : status === "not_configured" ? "[ NOT CONFIGURED ]"
    : status === "unauthorized" ? "[ UNAUTHORIZED ]"
    : "[ ERROR ]";

  const statusColor =
    status === "online" ? "text-primary"
    : status === "not_configured" ? "text-muted-foreground"
    : status === "error" || status === "unauthorized" ? "text-destructive"
    : "text-muted-foreground";

  return (
    <div className="space-y-6">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          // SHELL · LIVE · 04
        </div>
        <h1 className="font-mono text-2xl mt-1">Live terminál</h1>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          194.182.87.6 · server-side proxy · power-user režim bez allowlistu
        </p>
      </div>

      {/* Warning */}
      <div className="wire-border bg-[hsl(var(--wire-bg-soft))] p-4 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-destructive">
            // POWER-USER MODE
          </div>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            Tento panel obchádza allowlist zo /dashboard/shell. Každý príkaz ide cez server-side proxy
            (vps-exec-live edge funkcia) s admin-only guardom. Všetky príkazy sa logujú do{" "}
            <span className="text-foreground">admin_command_log</span> s prefixom [LIVE].
          </p>
        </div>
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHistory([])}
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
          >
            <Trash2 className="h-3 w-3" />
            clear
          </Button>
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
            // TERMINAL · LIVE
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            tapfast@vps · live
          </span>
        </div>

        <ScrollArea className="h-[480px]" ref={scrollRef}>
          <div className="p-4 font-mono text-xs space-y-3">
            {history.length === 0 && (
              <div className="text-muted-foreground">
                # live mode aktívny — bez allowlistu, len admin guard + audit. zadaj príkaz…
              </div>
            )}
            {history.map((entry, i) => (
              <div key={i} className="space-y-1">
                <div className="text-primary">
                  tapfast@vps:~# <span className="text-foreground">{entry.command}</span>
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
            {pending && <div className="text-muted-foreground animate-pulse">…executing</div>}
          </div>
        </ScrollArea>

        <div className="border-t border-dashed border-border px-4 py-2 flex items-center gap-2">
          <span className="font-mono text-xs text-destructive">#</span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={pending}
            placeholder="any command (max 2000 chars, no newlines)"
            className="font-mono text-xs border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-8"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default ShellLivePanel;
