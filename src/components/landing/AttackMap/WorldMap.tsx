import { useEffect, useState } from "react";
import { generatePing, GeoPing } from "@/lib/attack-log";

// Simplified wireframe-style continent outlines in 1000x500 viewBox.
// Not geographically accurate — just enough to read as "world map".
const CONTINENTS = [
  // North America
  "M120,140 L260,130 L290,170 L270,230 L230,260 L180,250 L140,210 Z",
  // South America
  "M300,290 L360,280 L380,340 L350,410 L320,420 L300,370 Z",
  // Europe
  "M520,140 L610,135 L620,180 L580,210 L530,200 L510,170 Z",
  // Africa
  "M520,230 L610,225 L640,290 L610,360 L560,380 L530,330 L510,280 Z",
  // Asia
  "M620,120 L860,130 L890,200 L850,260 L760,280 L680,260 L630,210 Z",
  // Southeast Asia / Indonesia
  "M790,290 L860,295 L870,320 L820,330 L790,315 Z",
  // Australia
  "M820,360 L900,365 L910,410 L850,420 L810,395 Z",
];

export const WorldMap = () => {
  const [pings, setPings] = useState<GeoPing[]>([]);
  const [lastEvent, setLastEvent] = useState<string>("waiting...");

  useEffect(() => {
    const tick = () => {
      const ping = generatePing();
      setPings((p) => [...p.slice(-5), ping]);
      setLastEvent(`[ATTACK] ${ping.ip} · ${ping.country} → BLOCKED`);

      // remove ping after animation
      setTimeout(() => {
        setPings((p) => p.filter((x) => x.id !== ping.id));
      }, 4000);
    };

    tick();
    const interval = setInterval(tick, 1500 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          // GLOBAL THREAT ORIGIN · realtime
        </div>
        <div className="font-mono text-[10px] tracking-[0.15em] text-primary tabular-nums">
          {pings.length} aktívnych
        </div>
      </div>

      <div className="relative wire-border bg-[hsl(var(--wire-bg-soft))] flex-1 overflow-hidden">
        {/* lat/lon grid */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* grid lines */}
          <g stroke="hsl(var(--wire-line) / 0.4)" strokeWidth="0.5" strokeDasharray="2 4">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={(i + 1) * 50} x2="1000" y2={(i + 1) * 50} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v${i}`} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="500" />
            ))}
          </g>

          {/* continents */}
          <g
            fill="hsl(var(--wire-line) / 0.15)"
            stroke="hsl(var(--wire-line-strong))"
            strokeWidth="1.2"
            strokeLinejoin="round"
          >
            {CONTINENTS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>

          {/* pings */}
          {pings.map((p) => (
            <g key={p.id}>
              {/* expanding ring */}
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              >
                <animate
                  attributeName="r"
                  from="4"
                  to="36"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.9"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={p.x}
                cy={p.y}
                r="3"
                fill="hsl(var(--primary))"
              />
              <text
                x={p.x + 8}
                y={p.y - 6}
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                fill="hsl(var(--foreground))"
              >
                {p.country}
              </text>
            </g>
          ))}

          {/* corner stamps */}
          <text
            x="10"
            y="16"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
            fill="hsl(var(--muted-foreground))"
          >
            FIG_09 · live-feed.svg
          </text>
          <text
            x="990"
            y="16"
            textAnchor="end"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
            fill="hsl(var(--muted-foreground))"
          >
            mercator · approx
          </text>
          <text
            x="10"
            y="492"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
            fill="hsl(var(--primary))"
          >
            {">>> "}{lastEvent}{" <<<"}
          </text>
        </svg>
      </div>

      {/* legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" /> active block
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full border border-primary" /> propagation
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-px bg-[hsl(var(--wire-line-strong))]" /> continent edge
        </span>
        <span className="ml-auto">node: nexify-eu-1</span>
      </div>
    </div>
  );
};
