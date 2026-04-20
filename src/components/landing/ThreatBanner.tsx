export const ThreatBanner = () => (
  <section className="mt-20">
    <div className="wire-border-solid bg-foreground text-background p-5 md:p-6 flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-start gap-4 flex-1 min-w-[280px]">
        <span className="font-mono text-2xl text-primary leading-none mt-1">⚠</span>
        <div>
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-background/60 mb-2">
            // global stat · 2026
          </div>
          <p className="text-base md:text-lg font-medium leading-snug">
            Každý deň niekto skúša, čo nechal internet otvorené.{" "}
            <span className="text-background/70">Otázka neznie, či sa niekto pozrie aj na váš web. Otázka znie, či tam v tej chvíli už </span>
            <span className="text-primary font-bold">niekto stojí</span>
            <span className="text-background/70">.</span>
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
