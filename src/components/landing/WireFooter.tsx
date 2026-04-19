export const WireFooter = () => (
  <footer className="mt-28 pt-10 border-t-[1.5px] border-dashed border-[hsl(var(--wire-line-strong))]">
    <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
      <div>
        <div className="wire-border-solid inline-block px-3 py-1.5 mb-4">
          <span className="font-mono text-xs tracking-[0.15em]">[ LOGO ]</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Nezávislý cybersec butik. Audit, pentest, incident response a retainery pre slovenské a české firmy.
        </p>
      </div>

      {[
        { title: "Služby", items: ["Audit logov", "WP hardening", "Pentest", "WAF setup"] },
        { title: "Spoločnosť", items: ["O nás", "Case studies", "Blog", "Kontakt"] },
        { title: "Legal", items: ["Privacy", "DPA", "Terms", "Cookies"] },
      ].map((col) => (
        <div key={col.title}>
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">{col.title}</div>
          <ul className="space-y-2">
            {col.items.map((i) => (
              <li key={i}>
                <a href="#" className="text-sm hover:text-primary transition-colors">{i}</a>
              </li>
            ))}
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
