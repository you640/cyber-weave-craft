import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { SectionCard } from "@/components/dashboard/ui/SectionCard";
import { StatusPill, StatusTone } from "@/components/dashboard/ui/StatusPill";
import { EmptyState } from "@/components/dashboard/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { LogIn, Plug, RefreshCw, Send, Trash2 } from "lucide-react";

interface McpTool { name: string; description?: string; inputSchema?: unknown; }
interface LogEntry { ts: string; dir: "→" | "←" | "!"; text: string; }

const PRESET_REQUESTS: { label: string; body: Record<string, unknown> }[] = [
  {
    label: "initialize",
    body: {
      jsonrpc: "2.0", id: 1, method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "nexify-dashboard", version: "0.1.0" } },
    },
  },
  { label: "tools/list", body: { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} } },
  { label: "ping", body: { jsonrpc: "2.0", id: 3, method: "ping", params: {} } },
];

type Status = "idle" | "loading" | "ready" | "not_configured" | "error" | "auth";

export const McpPanel = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [tools, setTools] = useState<McpTool[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [requestText, setRequestText] = useState<string>(JSON.stringify(PRESET_REQUESTS[1].body, null, 2));
  const [sending, setSending] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const pushLog = useCallback((entry: Omit<LogEntry, "ts">) => {
    setLog((prev) => [...prev, { ...entry, ts: new Date().toISOString().substring(11, 19) }].slice(-50));
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log]);

  const callMcp = useCallback(async (body: Record<string, unknown>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw Object.assign(new Error("Nie si prihlásený — prihlás sa znova."), { code: "NOT_AUTHENTICATED" });
    }
    const { data, error } = await supabase.functions.invoke("mcp-call", { body });
    if (error) {
      const msg =
        (data as { message?: string; error?: string } | null)?.message ??
        (data as { error?: string } | null)?.error ??
        error.message;
      const code = (data as { error?: string } | null)?.error;
      if (code === "MCP_NOT_CONFIGURED") throw Object.assign(new Error(msg), { code });
      if (code === "UPSTREAM_UNAVAILABLE" || /50[23]/.test(String(error.message ?? ""))) {
        throw Object.assign(new Error("MCP server dočasne nedostupný, skús znovu o chvíľu."), { code: "UPSTREAM_UNAVAILABLE" });
      }
      throw new Error(msg);
    }
    return data;
  }, []);

  const probe = useCallback(async () => {
    setStatus("loading");
    setStatusMsg("");
    try {
      pushLog({ dir: "→", text: "tools/list" });
      const res = (await callMcp(PRESET_REQUESTS[1].body)) as { result?: { tools?: McpTool[] }; error?: { message?: string } };
      if (res?.error) throw new Error(res.error.message ?? "MCP error");
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
      } else if (e.code === "NOT_AUTHENTICATED") {
        setStatus("auth");
        setStatusMsg(e.message ?? "Not authenticated");
      } else {
        setStatus("error");
        setStatusMsg(e.message ?? "Failed to reach MCP server");
        pushLog({ dir: "!", text: e.message ?? "error" });
      }
    }
  }, [callMcp, pushLog]);

  useEffect(() => { probe(); }, [probe]);

  const sendRequest = useCallback(async () => {
    let parsed: Record<string, unknown>;
    try { parsed = JSON.parse(requestText); }
    catch { pushLog({ dir: "!", text: "Invalid JSON" }); return; }
    setSending(true);
    pushLog({ dir: "→", text: String(parsed.method ?? "request") });
    try {
      const res = await callMcp(parsed);
      pushLog({ dir: "←", text: JSON.stringify(res).slice(0, 500) });
    } catch (err) {
      pushLog({ dir: "!", text: err instanceof Error ? err.message : "error" });
    } finally { setSending(false); }
  }, [requestText, callMcp, pushLog]);

  const tone: StatusTone =
    status === "ready" ? "ok" :
    status === "loading" ? "loading" :
    status === "not_configured" ? "warn" :
    status === "auth" ? "warn" :
    status === "error" ? "err" : "idle";

  const toneLabel =
    status === "ready" ? "ONLINE" :
    status === "loading" ? "PROBING" :
    status === "not_configured" ? "NOT CONFIGURED" :
    status === "auth" ? "AUTH" :
    status === "error" ? "ERROR" : "IDLE";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="// MCP · 04"
        title="MCP server proxy"
        description="Pošli JSON-RPC volania do svojho MCP serveru cez edge proxy."
        actions={
          <>
            <StatusPill tone={tone} label={toneLabel} />
            <Button variant="outline" size="sm" onClick={probe} className="h-8">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Re-probe
            </Button>
          </>
        }
      />

      {statusMsg && status !== "auth" && status !== "not_configured" && (
        <div className="text-xs text-muted-foreground font-mono">{statusMsg}</div>
      )}

      {status === "auth" && (
        <SectionCard padded={false}>
          <EmptyState
            icon={<LogIn className="h-5 w-5" />}
            title="Nie si prihlásený"
            description="MCP proxy volá edge function, ktorá vyžaduje aktívnu session."
            action={
              <a href="/auth" className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Prihlásiť sa →
              </a>
            }
          />
        </SectionCard>
      )}

      {status === "not_configured" && (
        <SectionCard eyebrow="// CONFIGURATION REQUIRED" title="MCP proxy nemá secrets">
          <p className="text-sm text-foreground leading-relaxed">
            MCP proxy potrebuje dva secrets, aby sa dostala k tvojmu MCP serveru:
          </p>
          <ul className="text-sm text-muted-foreground mt-3 space-y-2">
            <li>
              <code className="font-mono text-foreground bg-[hsl(var(--surface-muted))] px-1.5 py-0.5 rounded">MCP_SERVER_URL</code>
              {" "}— celá URL, napr. <code className="font-mono">https://194.182.87.6:8443/mcp</code>
            </li>
            <li>
              <code className="font-mono text-foreground bg-[hsl(var(--surface-muted))] px-1.5 py-0.5 rounded">MCP_SERVER_TOKEN</code>
              {" "}— voliteľný bearer token
            </li>
          </ul>
          <p className="text-xs text-muted-foreground mt-4">
            Pridaj ich cez Lovable Cloud → Secrets a potom klikni Re-probe.
          </p>
        </SectionCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Tools */}
        <SectionCard
          eyebrow="// TOOLS"
          title={`${tools.length} discovered`}
          className="lg:col-span-2"
          padded={false}
        >
          {tools.length === 0 ? (
            <EmptyState
              icon={<Plug className="h-5 w-5" />}
              title="Žiadne nástroje"
              description="Spusti probe pre načítanie zoznamu nástrojov."
            />
          ) : (
            <ul className="divide-y divide-[hsl(var(--border-subtle))] max-h-[420px] overflow-y-auto">
              {tools.map((t) => (
                <li key={t.name} className="px-5 py-3 text-sm">
                  <div className="font-mono text-foreground">
                    <span className="text-primary">›</span> {t.name}
                  </div>
                  {t.description && (
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.description}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        {/* Request console */}
        <SectionCard
          eyebrow="// JSON-RPC REQUEST"
          title="Console"
          className="lg:col-span-3"
          padded={false}
          actions={
            <div className="flex items-center gap-1">
              {PRESET_REQUESTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setRequestText(JSON.stringify(p.body, null, 2))}
                  className="font-mono text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-muted))] transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          }
        >
          <textarea
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            spellCheck={false}
            className="w-full min-h-[200px] bg-[hsl(var(--surface-muted))] text-foreground font-mono text-xs p-4 resize-y outline-none border-0 focus:ring-0"
          />
          <div className="px-5 py-3 border-t border-[hsl(var(--border-subtle))] flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {sending ? "sending…" : "ready"}
            </span>
            <Button
              size="sm"
              disabled={sending || status === "not_configured" || status === "auth"}
              onClick={sendRequest}
              className="h-8"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" /> Send
            </Button>
          </div>
        </SectionCard>
      </div>

      {/* Log */}
      <SectionCard
        eyebrow="// LOG"
        title="Posledných 50 udalostí"
        padded={false}
        actions={
          <Button variant="ghost" size="sm" onClick={() => setLog([])} className="h-8 text-muted-foreground">
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Clear
          </Button>
        }
      >
        <div className="max-h-64 overflow-y-auto p-4 font-mono text-[11px] space-y-1">
          {log.length === 0 ? (
            <div className="text-muted-foreground">[ idle ]</div>
          ) : (
            log.map((l, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-muted-foreground tracking-[0.1em]">{l.ts}</span>
                <span className={l.dir === "→" ? "text-primary" : l.dir === "←" ? "text-success" : "text-danger"}>
                  {l.dir}
                </span>
                <span className="text-foreground break-all">{l.text}</span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </SectionCard>
    </div>
  );
};
