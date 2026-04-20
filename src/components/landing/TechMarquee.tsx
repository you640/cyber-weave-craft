const techs = [
  "WORDPRESS",
  "SHOPIFY",
  "CLOUDFLARE",
  "AWS",
  "NGINX",
  "WOOCOMMERCE",
  "LARAVEL",
  "NEXT.JS",
];

export const TechMarquee = () => (
  <div className="mt-16 border-y border-dashed border-foreground/30 py-6 overflow-hidden">
    <div className="flex items-center gap-3 mb-4 px-2">
      <span className="font-mono text-[10px] text-muted-foreground tracking-[0.25em] uppercase">
        // strážime stack ktorý poznáte
      </span>
      <div className="flex-1 h-px border-t border-dashed border-foreground/20" />
    </div>
    <div className="relative">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...techs, ...techs].map((t, i) => (
          <span
            key={i}
            className="font-mono text-sm md:text-base font-bold text-muted-foreground/60 tracking-[0.2em] hover:text-foreground transition-colors"
          >
            ▍ {t}
          </span>
        ))}
      </div>
    </div>
  </div>
);
