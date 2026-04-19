export const ThreatBanner = () => (
  <section className="mt-20">
    <div className="wire-border-solid bg-foreground text-background p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="font-mono text-2xl text-primary leading-none">⚠</span>
        <div>
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-background/60 mb-1">
            // global stat · 2026
          </div>
          <p className="text-base md:text-lg font-medium leading-snug">
            Každých <span className="text-primary font-bold">39 sekúnd</span> je niekde na svete hacknutý jeden web.{" "}
            <span className="text-background/70">Váš nemusí byť ďalší.</span>
          </p>
        </div>
      </div>
      <a
        href="#balíčky"
        className="font-mono text-xs px-5 py-3 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all whitespace-nowrap"
      >
        [ Spustiť dohľad → ]
      </a>
    </div>
  </section>
);
