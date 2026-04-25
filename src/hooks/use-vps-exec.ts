import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VpsExecResult {
  exit_code: number;
  stdout: string;
  stderr: string;
  duration_ms: number;
}

interface State {
  data: VpsExecResult | null;
  error: string | null;
  loading: boolean;
}

const friendlyError = (raw: string): string => {
  if (/NOT_AUTHENTICATED/i.test(raw)) return "Nie si prihlásený — prihlás sa znova.";
  if (/UPSTREAM_UNAVAILABLE|BRIDGE_ERROR|BRIDGE_NOT_CONFIGURED|UPSTREAM_UNREACHABLE|50[23]/i.test(raw)) {
    return "Backend dočasne nedostupný, skús znovu o chvíľu.";
  }
  return raw;
};

export const useVpsExec = () => {
  const [state, setState] = useState<State>({ data: null, error: null, loading: false });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(async (command: string): Promise<VpsExecResult | null> => {
    if (mounted.current) setState((s) => ({ ...s, loading: true, error: null }));

    // Session guard — never fire the call without auth.
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      if (mounted.current) setState({ data: null, error: "NOT_AUTHENTICATED", loading: false });
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke("vps-exec", {
        body: { command },
      });
      if (error) {
        const raw = error.message || "Edge function error";
        if (mounted.current) setState({ data: null, error: friendlyError(raw), loading: false });
        return null;
      }
      if (data?.error) {
        const raw = `${data.error}${data.reason ? ": " + data.reason : ""}${data.message ? ": " + data.message : ""}`;
        if (mounted.current) setState({ data: null, error: friendlyError(raw), loading: false });
        return null;
      }
      const result = data as VpsExecResult;
      if (mounted.current) setState({ data: result, error: null, loading: false });
      return result;
    } catch (e) {
      const raw = e instanceof Error ? e.message : "Unknown error";
      if (mounted.current) setState({ data: null, error: friendlyError(raw), loading: false });
      return null;
    }
  }, []);

  return { ...state, run };
};
