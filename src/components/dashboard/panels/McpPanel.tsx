import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface McpTool {
  name: string;
  description?: string;
  inputSchema?: unknown;
}

interface LogEntry {
  ts: string;
  dir: "→" | "←" | "!";
  text: string;
}

const PRESET_REQUESTS: { label: string; body: Record<string, unknown> }[] = [
  {
    label: "initialize",
    body: {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "nexify-dashboard", version: "0.1.0" },
      },
    },
  },
  {
    label: "tools/list",
    body: { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
  },
  {
    label: "ping",
    body: { jsonrpc: "2.0", id: 3, method: "ping", params: {} },
  },
];

export const McpPanel = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "not_configured" | "error"
  >("idle");
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [tools, setTools] = useState<McpTool[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [requestText, setRequestText] = useState<string>(
    JSON.stringify(PRESET_REQUESTS[1].body, null, 2),
  );
  const [sending, setSending] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const pushLog = useCallback((entry: Omit<LogEntry, "ts">) => {
    setLog((prev) =>
      [
        ...prev,
        { ...entry, ts: new Date().toISOString().substring(11, 19) },
      ].slice(-50),
    );
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log]);

  const callMcp = useCallback(
    async (body: Record<string, unknown>) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw Object.assign(new Error("Nie si prihlásený — prihlás sa znova."), {
          code: "NOT_AUTHENTICATED",
        });
      }
      const { data, error } = await supabase.functions.invoke("mcp-call", {
        body,
      });
      if (error) {
        const msg =
          (data as { message?: string; error?: string } | null)?.message ??
          (data as { error?: string } | null)?.error ??
          error.message;
        const code = (data as { error?: string } | null)?.error;
        if (code === "MCP_NOT_CONFIGURED") {
          throw Object.assign(new Error(msg), { code });
        }
        if (code === "UPSTREAM_UNAVAILABLE" || /50[23]/.test(String(error.message ?? ""))) {
          throw Object.assign(
            new Error("MCP server dočasne nedostupný, skús znovu o chvíľu."),
            { code: "UPSTREAM_UNAVAILABLE" },
          );
        }
        throw new Error(msg);
      }
      return data;
    },
    [],
  );

  const probe = useCallback(async () => {
    setStatus("loading");
    setStatusMsg("");
    try {
      pushLog({ dir: "→", text: "tools/list" });
      const res = (await callMcp(PRESET_REQUESTS[1].body)) as {
        result?: { tools?: McpTool[] };
        error?: { message?: string };
      };
      if (res?.error) {
        throw new Error(res.error.message ?? "MCP error");
      }
      const list = res?.result?.tools ?? [];
      setTools(list);
      setStatus("ready");
      setStatusMsg(`${list.length} tools available`);
      pushLog({ dir: "←", text: `${list.length} tools` });
    } catch (err) {
      const e = err as { code?: string; message?: string };
      if (e.code === "MCP_NOT_CONFIGURED") {
        setStatus("not_configured");
        setStatusMsg(e.message ?? "Not configured");
      } else {
        setStatus("error");
        setStatusMsg(e.message ?? "Failed to reach MCP server");
        pushLog({ dir: "!", text: e.message ?? "error" });
      }
    }
  }, [callMcp, pushLog]);

  useEffect(() => {
    probe();
  }, [probe]);

  const sendRequest = useCallback(async () => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(requestText);
    } catch {
      pushLog({ dir: "!", text: "Invalid JSON" });
      return;
    }
    setSending(true);
    pushLog({ dir: "→", text: String(parsed.method ?? "request") });
    try {
      const res = await callMcp(parsed);
      pushLog({
        dir: "←",
        text: JSON.stringify(res).slice(0, 500),
      });
    } catch (err) {
      pushLog({
        dir: "!",
        text: err instanceof Error ? err.message : "error",
      });
    } finally {
      setSending(false);
    }
  }, [requestText, callMcp, pushLog]);

  const statusDot =
    status === "ready"
      ? "bg-primary"
      : status === "loading"
        ? "bg-muted-foreground animate-pulse"
        : status === "not_configured"
          ? "bg-muted-foreground"
          : status === "error"
            ? "bg-destructive"
            : "bg-muted-foreground";

  const statusLabel =
    status === "ready"
      ? "ONLINE"
      : status === "loading"
        ? "PROBING"
        : status === "not_configured"
          ? "NOT CONFIGURED"
          : status === "error"
            ? "ERROR"
            : "IDLE";

  return (
    <div className="space-y-8">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          // MCP · 04
        </div>
        <h1 className="font-mono text-2xl md:text-3xl mt-2 text-foreground">
          MCP server proxy
        </h1>
        <div className="border-t border-dashed border-border mt-4" />
      </div>

      {/* Status bar */}
      <div className="wire-border bg-[hsl(var(--wire-bg-soft))] px-4 py-3 font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground flex items-center gap-3 flex-wrap">
        <span className={`h-2 w-2 rounded-full ${statusDot}`} />
        <span>{statusLabel}</span>
        {statusMsg && (
          <>
            <span className="opacity-50">·</span>
            <span className="normal-case tracking-normal text-xs text-foreground">
              {statusMsg}
            </span>
          </>
        )}
        <button
          type="button"
          onClick={probe}
          className="ml-auto text-[10px] tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors"
        >
          [ re-probe ]
        </button>
      </div>

      {status === "not_configured" && (
        <div className="wire-border wire-shadow bg-background p-5 space-y-3">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            // CONFIGURATION REQUIRED
          </div>
          <p className="font-mono text-xs text-foreground leading-relaxed">
            MCP proxy needs two secrets to reach your MCP server:
          </p>
          <ul className="font-mono text-xs text-muted-foreground space-y-1 pl-4">
            <li>
              <span className="text-foreground">MCP_SERVER_URL</span> — full
              endpoint, e.g. <code>https://194.182.87.6:8443/mcp</code>
            </li>
            <li>
              <span className="text-foreground">MCP_SERVER_TOKEN</span> —
              optional bearer token your server validates
            </li>
          </ul>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground pt-2">
            Add them via Lovable Cloud → Secrets, then click [ re-probe ].
          </p>
        </div>
      )}

      {/* Tools list + request console */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="wire-border wire-shadow bg-background lg:col-span-2">
          <div className="px-5 py-3 border-b border-dashed border-border font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            // TOOLS
          </div>
          {tools.length === 0 ? (
            <div className="p-5 font-mono text-xs text-muted-foreground">
              [ no tools discovered ]
            </div>
          ) : (
            <ul className="divide-y divide-dashed divide-border">
              {tools.map((t) => (
                <li key={t.name} className="px-5 py-3 font-mono text-xs">
                  <div className="text-foreground">
                    <span className="text-primary">›</span> {t.name}
                  </div>
                  {t.description && (
                    <div className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                      {t.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="wire-border wire-shadow bg-background lg:col-span-3 flex flex-col">
          <div className="px-5 py-3 border-b border-dashed border-border flex items-center justify-between gap-3 flex-wrap">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              // JSON-RPC REQUEST
            </div>
            <div className="flex items-center gap-2">
              {PRESET_REQUESTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() =>
                    setRequestText(JSON.stringify(p.body, null, 2))
                  }
                  className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  [ {p.label} ]
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            spellCheck={false}
            className="flex-1 min-h-[180px] bg-background text-foreground font-mono text-xs p-4 resize-y outline-none border-0 focus:ring-0"
          />
          <div className="px-5 py-3 border-t border-dashed border-border flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {sending ? "sending…" : "ready"}
            </span>
            <button
              type="button"
              disabled={sending || status === "not_configured"}
              onClick={sendRequest}
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              [ send → ]
            </button>
          </div>
        </div>
      </div>

      {/* Log */}
      <div className="wire-border wire-shadow bg-background">
        <div className="px-5 py-3 border-b border-dashed border-border flex items-center justify-between">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            // LOG
          </div>
          <button
            type="button"
            onClick={() => setLog([])}
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            [ clear ]
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto p-4 font-mono text-[11px] space-y-1">
          {log.length === 0 ? (
            <div className="text-muted-foreground">[ idle ]</div>
          ) : (
            log.map((l, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-muted-foreground tracking-[0.1em]">
                  {l.ts}
                </span>
                <span
                  className={
                    l.dir === "→"
                      ? "text-primary"
                      : l.dir === "←"
                        ? "text-foreground"
                        : "text-destructive"
                  }
                >
                  {l.dir}
                </span>
                <span className="text-foreground break-all">{l.text}</span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};
