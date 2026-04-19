export type AttackAction = "BLOCK" | "ALERT" | "MITIGATE" | "ALLOW";

export type AttackType =
  | "brute-force"
  | "sql-inject"
  | "xss"
  | "ddos"
  | "bot-scrape"
  | "credential-stuff"
  | "path-traversal"
  | "rce-attempt";

export interface LogEntry {
  id: string;
  timestamp: string;
  ip: string;
  country: string;
  countryCode: string;
  type: AttackType;
  target: string;
  action: AttackAction;
}

export interface GeoPing {
  id: string;
  country: string;
  /** SVG x in 0..1000 viewbox */
  x: number;
  /** SVG y in 0..500 viewbox */
  y: number;
  type: AttackType;
  ip: string;
}

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
  "185.220",
  "91.92",
  "45.155",
  "194.36",
  "103.224",
  "5.188",
  "171.25",
  "192.42",
  "23.129",
  "162.247",
];

const TARGETS = [
  "/wp-admin",
  "/wp-login.php",
  "/.env",
  "/api/v1/auth",
  "/admin/login",
  "/xmlrpc.php",
  "/api/users",
  "/checkout",
  "/?id=1' OR '1'='1",
  "/cart/add",
  "/api/graphql",
  "/.git/config",
  "/phpmyadmin",
  "/api/orders",
];

const TYPES: AttackType[] = [
  "brute-force",
  "sql-inject",
  "xss",
  "ddos",
  "bot-scrape",
  "credential-stuff",
  "path-traversal",
  "rce-attempt",
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const fakeIp = (prefix: string) => `${prefix}.${randInt(1, 254)}.${randInt(1, 254)}`;

export function generateLogEntry(): LogEntry {
  const country = pick(COUNTRIES);
  const type = pick(TYPES);
  const target = pick(TARGETS);
  const ip = fakeIp(pick(IP_PREFIXES));

  // Mostly BLOCK, occasionally ALERT or MITIGATE
  const r = Math.random();
  const action: AttackAction =
    r < 0.78 ? "BLOCK" : r < 0.92 ? "MITIGATE" : "ALERT";

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: `${hh}:${mm}:${ss}`,
    ip,
    country: country.name,
    countryCode: country.code,
    type,
    target,
    action,
  };
}

export function generatePing(): GeoPing {
  const country = pick(COUNTRIES);
  const type = pick(TYPES);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    country: country.name,
    // small jitter so pings don't all stack
    x: country.x + randInt(-12, 12),
    y: country.y + randInt(-8, 8),
    type,
    ip: fakeIp(pick(IP_PREFIXES)),
  };
}

export const ATTACK_TYPES = TYPES;
