export const WireNav = () => (
  <nav className="wire-border-solid bg-background sticky top-4 z-40 mx-auto max-w-7xl">
    <div className="flex items-center justify-between px-4 md:px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="wire-border bg-[hsl(var(--wire-bg-soft))] px-3 py-1.5">
          <span className="font-mono text-xs tracking-[0.15em]">[ LOGO ]</span>
        </div>
        <span className="hidden md:inline font-mono text-[10px] text-muted-foreground tracking-[0.2em]">v1.0 · WIREFRAME</span>
      </div>

      <div className="hidden md:flex items-center gap-1 font-mono text-xs">
        {[
          { label: "Strážna služba", href: "#strážna-služba" },
          { label: "Balíčky", href: "#balíčky" },
          { label: "Hrozby", href: "#hrozby" },
          { label: "Príbehy", href: "#príbehy" },
          { label: "FAQ", href: "#faq" },
        ].map((l) => (
          <a key={l.label} href={l.href} className="px-3 py-2 border border-transparent hover:border-dashed hover:border-foreground transition-colors">
            {l.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden sm:block font-mono text-xs px-3 py-2 wire-border">Login</button>
        <button className="font-mono text-xs px-3 py-2 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
          Get audit →
        </button>
      </div>
    </div>
  </nav>
);
