import { useEffect, useRef, useState } from "react";

export interface AttackEvent {
  id: string;
  timestamp: string;
  ts: number;
  ip: string;
  country: string;
  countryCode: string;
  x: number;
  y: number;
  type: string;
  target: string;
  action: "BLOCK" | "MITIGATE" | "ALERT";
}

interface StreamState {
  events: AttackEvent[];
  counter: number;
  connected: boolean;
}

const STREAM_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/attack-stream`;

/**
 * Subscribes to the server-sent attack event stream.
 * Returns rolling buffer of recent events + the live counter value.
 */
export function useAttackStream(maxEvents = 30) {
  const [state, setState] = useState<StreamState>({
    events: [],
    counter: 0,
    connected: false,
  });
  const reconnectRef = useRef<number | null>(null);

  useEffect(() => {
    let es: EventSource | null = null;
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      es = new EventSource(STREAM_URL);

      es.addEventListener("snapshot", (e) => {
        try {
          const data = JSON.parse((e as MessageEvent).data);
          setState({
            events: data.events ?? [],
            counter: data.counter ?? 0,
            connected: true,
          });
        } catch (_e) {
          // ignore
        }
      });

      es.addEventListener("attack", (e) => {
        try {
          const evt = JSON.parse((e as MessageEvent).data) as AttackEvent;
          setState((s) => ({
            ...s,
            events: [evt, ...s.events].slice(0, maxEvents),
            counter: s.counter + 1,
          }));
        } catch (_e) {
          // ignore
        }
      });

      es.addEventListener("counter", (e) => {
        try {
          const data = JSON.parse((e as MessageEvent).data);
          setState((s) => ({ ...s, counter: data.value ?? s.counter }));
        } catch (_e) {
          // ignore
        }
      });

      es.onopen = () => {
        setState((s) => ({ ...s, connected: true }));
      };

      es.onerror = () => {
        setState((s) => ({ ...s, connected: false }));
        es?.close();
        if (!cancelled) {
          reconnectRef.current = window.setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      es?.close();
    };
  }, [maxEvents]);

  return state;
}
