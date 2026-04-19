import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.103.3/cors";

// Server-side attack event generator streamed via Server-Sent Events.
// No auth required — public live feed.

type AttackAction = "BLOCK" | "MITIGATE" | "ALERT";
type AttackType =
  | "brute-force"
  | "sql-inject"
  | "xss"
  | "ddos"
  | "bot-scrape"
  | "credential-stuff"
  | "path-traversal"
  | "rce-attempt";

const COUNTRIES = [
  { name: "Rusko", code: "RU", x: 700, y: 130 },
  { name: "Čína", code: "CN", x: 800, y: 200 },
  { name: "Nigéria", code: "NG", x: 530, y: 310 },
  { name: "USA", code: "US", x: 220, y: 200 },
  { name: "Brazília", code: "BR", x: 340, y: 340 },
  { name: "Vietnam", code: "VN", x: 790, y: 260 },
  { name: "Irán", code: "IR", x: 620, y: 220 },
  { name: "Ukrajina", code: "UA", x: 580, y: 170 },
  { name: "India", code: "IN", x: 720, y: 250 },
  { name: "Turecko", code: "TR", x: 580, y: 200 },
];

const IP_PREFIXES = [
  "185.220", "91.92", "45.155", "194.36", "103.224",
  "5.188", "171.25", "192.42", "23.129", "162.247",
];

const TARGETS = [
  "/wp-admin", "/wp-login.php", "/.env", "/api/v1/auth", "/admin/login",
  "/xmlrpc.php", "/api/users", "/checkout", "/?id=1' OR '1'='1",
  "/cart/add", "/api/graphql", "/.git/config", "/phpmyadmin", "/api/orders",
];

const TYPES: AttackType[] = [
  "brute-force", "sql-inject", "xss", "ddos",
  "bot-scrape", "credential-stuff", "path-traversal", "rce-attempt",
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const fakeIp = (prefix: string) => `${prefix}.${randInt(1, 254)}.${randInt(1, 254)}`;

function generateEvent() {
  const country = pick(COUNTRIES);
  const type = pick(TYPES);
  const target = pick(TARGETS);
  const ip = fakeIp(pick(IP_PREFIXES));
  const r = Math.random();
  const action: AttackAction = r < 0.78 ? "BLOCK" : r < 0.92 ? "MITIGATE" : "ALERT";
  const now = new Date();
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");

  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: `${hh}:${mm}:${ss}`,
    ts: now.getTime(),
    ip,
    country: country.name,
    countryCode: country.code,
    x: country.x + randInt(-12, 12),
    y: country.y + randInt(-8, 8),
    type,
    target,
    action,
  };
}

// Counter is derived from time-since-midnight UTC so all clients see the same number.
function counterAt(ts: number) {
  const d = new Date(ts);
  const midnight = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const elapsedSec = (ts - midnight) / 1000;
  // ~0.6 events/sec base + slight wobble
  return Math.floor(12 + elapsedSec * 0.62);
}

Deno.serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
          );
        } catch (_e) {
          // controller closed
        }
      };

      // initial snapshot
      const initial = Array.from({ length: 8 }, () => generateEvent());
      send("snapshot", { events: initial, counter: counterAt(Date.now()) });

      // attack event ticker (random interval 700–2400ms)
      let attackTimer: number;
      const tickAttack = () => {
        const evt = generateEvent();
        send("attack", evt);
        attackTimer = setTimeout(tickAttack, 700 + Math.random() * 1700);
      };
      attackTimer = setTimeout(tickAttack, 600);

      // counter sync every 2s
      const counterTimer = setInterval(() => {
        send("counter", { value: counterAt(Date.now()) });
      }, 2000);

      // heartbeat every 15s to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch (_e) {
          // ignore
        }
      }, 15000);

      // cleanup on disconnect
      req.signal.addEventListener("abort", () => {
        clearTimeout(attackTimer);
        clearInterval(counterTimer);
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch (_e) {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
});
