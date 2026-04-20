import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Command } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { MobileNav } from "./MobileNav";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useActiveSection } from "@/hooks/use-active-section";
import nexifyLogo from "@/assets/nexify-logo.png";
import nexifyShield from "@/assets/nexify-shield.png";

const landingLinks = [
  { label: "Strážna služba", href: "#strážna-služba", id: "strážna-služba" },
  { label: "Balíčky", href: "#balíčky", id: "balíčky" },
  { label: "Hrozby", href: "#hrozby", id: "hrozby" },
  { label: "Príbehy", href: "#príbehy", id: "príbehy" },
  { label: "FAQ", href: "#faq", id: "faq" },
];

export const WireNav = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const scrolled = useScrollPosition(40);
  const activeId = useActiveSection(isLanding ? landingLinks.map((l) => l.id) : []);

  return (
    <nav
      className={`sticky top-4 z-40 mx-auto max-w-7xl wire-border-solid bg-background/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-[4px_4px_0_0_hsl(var(--foreground))] top-2" : "shadow-none"
      }`}
    >
      <div
        className={`flex items-center justify-between px-3 md:px-6 transition-all duration-300 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        {/* LEFT: logo + status */}
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img
              src={nexifyShield}
              alt="Nexify Guard"
              className={`md:hidden w-auto object-contain group-hover:scale-105 transition-all [filter:drop-shadow(0_4px_10px_hsl(var(--foreground)/0.4))] ${
                scrolled ? "h-9" : "h-11"
              }`}
            />
            <img
              src={nexifyLogo}
              alt="Nexify Guard logo"
              className={`hidden md:block w-auto object-contain group-hover:scale-105 transition-all [filter:drop-shadow(0_6px_14px_hsl(var(--foreground)/0.45))_drop-shadow(0_2px_4px_hsl(var(--foreground)/0.3))] ${
                scrolled ? "h-16" : "h-24"
              }`}
            />
          </Link>
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-dashed border-foreground/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
              Online · sentinel-01
            </span>
          </div>
        </div>

        {/* CENTER: links */}
        <div className="hidden md:flex items-center gap-0.5 font-mono text-xs">
          {isLanding ? (
            landingLinks.map((l) => {
              const isActive = activeId === l.id;
              return (
                <a
                  key={l.label}
                  href={l.href}
                  className={`group relative px-3 py-2 transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    [
                  </span>
                  <span className="px-1">{l.label}</span>
                  <span
                    className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    ]
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-primary" />
                  )}
                </a>
              );
            })
          ) : (
            <>
              <Link to="/" className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">← Hlavná</Link>
              <Link to="/o-nas" className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">O nás</Link>
              <Link to="/case-studies" className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">Case studies</Link>
              <Link to="/blog" className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link to="/kontakt" className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">Kontakt</Link>
            </>
          )}
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:inline-flex items-center gap-1 px-2 py-1 wire-border bg-background font-mono text-[10px] text-muted-foreground">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
          <div className="hidden md:block">
            <UserMenu />
          </div>
          <Link
            to="/kontakt"
            className="group hidden sm:inline-flex items-center gap-1.5 font-mono text-xs px-3 py-2 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            Audit
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <MobileNav links={landingLinks} isLanding={isLanding} />
        </div>
      </div>
    </nav>
  );
};
