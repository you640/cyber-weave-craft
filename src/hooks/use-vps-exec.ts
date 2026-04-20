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
    try {
      const { data, error } = await supabase.functions.invoke("vps-exec", {
        body: { command },
      });
      if (error) {
        const msg = error.message || "Edge function error";
        if (mounted.current) setState({ data: null, error: msg, loading: false });
        return null;
      }
      if (data?.error) {
        const msg = `${data.error}${data.reason ? ": " + data.reason : ""}${data.message ? ": " + data.message : ""}`;
        if (mounted.current) setState({ data: null, error: msg, loading: false });
        return null;
      }
      const result = data as VpsExecResult;
      if (mounted.current) setState({ data: result, error: null, loading: false });
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      if (mounted.current) setState({ data: null, error: msg, loading: false });
      return null;
    }
  }, []);

  return { ...state, run };
};
