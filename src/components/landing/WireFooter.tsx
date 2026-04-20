import { Link } from "react-router-dom";
import nexifyLogo from "@/assets/nexify-logo.png";

const columns = [
  {
    title: "Služby",
    items: [
      { label: "Audit logov", href: "/#služby" },
      { label: "WP hardening", href: "/#služby" },
      { label: "Pentest", href: "/#služby" },
      { label: "WAF setup", href: "/#služby" },
    ],
  },
  {
    title: "Spoločnosť",
    items: [
      { label: "O nás", href: "/o-nas" },
      { label: "Case studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "DPA", href: "/dpa" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

export const WireFooter = () => (
  <footer className="mt-28 pt-10 border-t-[1.5px] border-dashed border-[hsl(var(--wire-line-strong))]">
    <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <img
            src={nexifyLogo}
            alt="Nexify Studio Tech logo"
            width={44}
            height={44}
            className="w-11 h-11 object-contain group-hover:scale-105 transition-transform"
          />
          <span className="font-display font-bold text-base tracking-tight">
            NEXIFY <span className="font-light italic text-primary">studio</span>
          </span>
        </Link>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Nezávislý cybersec butik pre slovenské a české firmy. Audit, pentest, hardening, monitoring a incident response pre tímy, ktoré radšej investujú do obrany než do neskorého ľutovania.
        </p>
      </div>

      {columns.map((col) => (
        <div key={col.title}>
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
            {col.title}
          </div>
          <ul className="space-y-2">
            {col.items.map((i) => {
              const isExternal = i.href.startsWith("/#") || i.href.startsWith("http");
              return (
                <li key={i.label}>
                  {isExternal ? (
                    <a href={i.href} className="text-sm hover:text-primary transition-colors">
                      {i.label}
                    </a>
                  ) : (
                    <Link to={i.href} className="text-sm hover:text-primary transition-colors">
                      {i.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>

    <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-dashed border-[hsl(var(--wire-line))]">
      <div className="font-mono text-xs tracking-[0.15em]">
        // signed: <span className="text-primary font-medium">nexify-studio.tech</span>
      </div>
      <div className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
        CENNÍK · 2026 · v1.0 · SK / CZ · WIREFRAME
      </div>
    </div>
  </footer>
);
