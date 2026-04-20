import { useEffect, useState } from "react";
import { useAttackStream } from "@/hooks/use-attack-stream";

export const AnnouncementTicker = () => {
  const { counter, connected } = useAttackStream();
  const [idx, setIdx] = useState(0);

  const messages = [
    {
      icon: "●",
      text: connected
        ? `LIVE · Blokovaných útokov dnes: ${counter.toLocaleString("sk-SK")}`
        : "LIVE · Pripájam sa na SOC stream…",
      pulse: true,
    },
    { icon: "🛡", text: "SOC online · reakcia < 4h", pulse: false },
    { icon: "📍", text: "SK · CZ · 2026 · sentinel-01", pulse: false },
  ];

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 3500);
    return () => clearInterval(t);
  }, [messages.length]);

  return (
    <div className="inline-flex items-center gap-2 wire-border px-3 py-1.5 bg-gradient-to-r from-background via-[hsl(var(--wire-bg-soft))] to-background overflow-hidden">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`items-center gap-2 transition-all duration-500 ${
            i === idx ? "flex opacity-100" : "hidden opacity-0"
          }`}
        >
          <span
            className={`text-primary text-xs ${m.pulse ? "animate-pulse" : ""}`}
            aria-hidden
          >
            {m.icon}
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase tabular-nums">
            {m.text}
          </span>
        </div>
      ))}
    </div>
  );
};
