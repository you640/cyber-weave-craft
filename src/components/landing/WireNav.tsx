import { Link, useLocation } from "react-router-dom";
import { UserMenu } from "@/components/auth/UserMenu";
import nexifyLogo from "@/assets/nexify-logo.png";
import nexifyShield from "@/assets/nexify-shield.png";

const landingLinks = [
  { label: "Strážna služba", href: "#strážna-služba" },
  { label: "Balíčky", href: "#balíčky" },
  { label: "Hrozby", href: "#hrozby" },
  { label: "Príbehy", href: "#príbehy" },
  { label: "FAQ", href: "#faq" },
];

export const WireNav = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return (
    <nav className="wire-border-solid bg-background sticky top-4 z-40 mx-auto max-w-7xl">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={nexifyLogo}
              alt="Nexify Guard logo"
              className="h-28 w-auto object-contain group-hover:scale-105 transition-transform [filter:drop-shadow(0_6px_14px_hsl(var(--foreground)/0.45))_drop-shadow(0_2px_4px_hsl(var(--foreground)/0.3))]"
            />
          </Link>
          <span className="hidden lg:inline font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
            v1.0 · GUARD
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1 font-mono text-xs">
          {isLanding ? (
            landingLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-3 py-2 border border-transparent hover:border-dashed hover:border-foreground transition-colors"
              >
                {l.label}
              </a>
            ))
          ) : (
            <>
              <Link to="/" className="px-3 py-2 border border-transparent hover:border-dashed hover:border-foreground transition-colors">
                ← Hlavná
              </Link>
              <Link to="/o-nas" className="px-3 py-2 border border-transparent hover:border-dashed hover:border-foreground transition-colors">
                O nás
              </Link>
              <Link to="/case-studies" className="px-3 py-2 border border-transparent hover:border-dashed hover:border-foreground transition-colors">
                Case studies
              </Link>
              <Link to="/blog" className="px-3 py-2 border border-transparent hover:border-dashed hover:border-foreground transition-colors">
                Blog
              </Link>
              <Link to="/kontakt" className="px-3 py-2 border border-transparent hover:border-dashed hover:border-foreground transition-colors">
                Kontakt
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <UserMenu />
          <Link
            to="/kontakt"
            className="font-mono text-xs px-3 py-2 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            Get audit →
          </Link>
        </div>
      </div>
    </nav>
  );
};
