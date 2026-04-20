import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import nexifyShield from "@/assets/nexify-shield.png";

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  links: NavLink[];
  isLanding: boolean;
}

export const MobileNav = ({ links, isLanding }: Props) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const otherLinks = [
    { label: "Hlavná", to: "/" },
    { label: "O nás", to: "/o-nas" },
    { label: "Case studies", to: "/case-studies" },
    { label: "Blog", to: "/blog" },
    { label: "Kontakt", to: "/kontakt" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Otvoriť menu"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 wire-border bg-background hover:bg-[hsl(var(--wire-bg-soft))] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 wire-border-solid bg-background"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-dashed border-foreground/30">
          <div className="flex items-center gap-2">
            <img src={nexifyShield} alt="Nexify Guard" className="h-8 w-auto" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">
              v1.0 · GUARD
            </span>
          </div>
          <button
            aria-label="Zavrieť menu"
            onClick={() => setOpen(false)}
            className="w-9 h-9 inline-flex items-center justify-center wire-border bg-background"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-6 flex flex-col gap-1">
          <span className="font-mono text-[9px] text-muted-foreground tracking-[0.25em] uppercase mb-2">
            // navigácia
          </span>
          {isLanding
            ? links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between py-3 px-3 wire-border bg-background hover:bg-[hsl(var(--wire-bg-soft))] hover:translate-x-1 transition-all"
                >
                  <span className="font-mono text-sm">[ {l.label} ]</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              ))
            : otherLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between py-3 px-3 wire-border bg-background hover:bg-[hsl(var(--wire-bg-soft))] hover:translate-x-1 transition-all"
                >
                  <span className="font-mono text-sm">[ {l.label} ]</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
        </div>

        <div className="px-5 py-6 border-t border-dashed border-foreground/30 mt-auto">
          <Link
            to="/kontakt"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full font-mono text-sm px-4 py-3 bg-primary text-primary-foreground wire-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Objednať audit
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-4 font-mono text-[10px] text-muted-foreground text-center tracking-wider">
            ● ONLINE · sentinel-01 · SK / CZ
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
