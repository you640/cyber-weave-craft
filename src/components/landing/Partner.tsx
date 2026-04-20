import { SectionMarker, WireAnnotation } from "./WireAnnotation";
import gruppaLogo from "@/assets/gruppa-logo.svg";

const pillars = [
  {
    code: "P_01",
    title: "Architektúra",
    body: "Presná, dokumentovaná, pripravená na rast.",
  },
  {
    code: "P_02",
    title: "Škálovateľnosť",
    body: "Riešenia ktoré rastú s biznisom — bez prepisovania od nuly.",
  },
  {
    code: "P_03",
    title: "Kvalita & rozvoj",
    body: "Code review, testy a dlhodobá podpora po nasadení.",
  },
];

export const Partner = () => (
  <section id="partner" className="mt-28 scroll-mt-24">
    <SectionMarker num="08" label="Partner · Enterprise stack" />

    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
      <div className="max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Bezpečnosť stojí lepšie na <span className="font-display italic font-light text-primary">silnej architektúre</span>
        </h2>
        <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
          Za Nexify Guard nestojí len monitoring a alerty, ale aj technologické zázemie ľudí, ktorí rozumejú enterprise vývoju, architektúre a dlhodobo udržateľným systémom.
        </p>
        <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
          Inými slovami: nelepíme náplasť na deravú stenu a netvárime sa, že je to stratégia. Keď sa má niečo opraviť, opraví sa to tak, aby to dávalo zmysel aj o rok, nielen do ďalšieho deployu.
        </p>
      </div>
      <div className="hidden md:block">
        <WireAnnotation rotate={-3}>náš technologický chrbát</WireAnnotation>
      </div>
    </div>

    <div className="grid lg:grid-cols-12 gap-6">
      {/* Logo card */}
      <div className="lg:col-span-5">
        <div className="wire-border bg-background wire-shadow p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
              FIG_08 · partner.svg
            </span>
            <span className="font-mono text-[10px] text-primary">● VERIFIED</span>
          </div>

          <div className="flex-1 flex items-center justify-center bg-[hsl(var(--wire-bg-soft))] wire-border p-10 md:p-14">
            <img
              src={gruppaLogo}
              alt="GRUPPA — partner pre enterprise development"
              className="w-full max-w-[260px] h-auto"
              loading="lazy"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-dashed border-[hsl(var(--wire-line))] flex items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
                // technologický partner
              </div>
              <div className="text-sm font-medium">
                nexify-studio.tech <span className="text-muted-foreground">↔</span> GRUPPA
              </div>
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              EST. 2024
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-7">
        <div className="wire-border bg-background p-6 md:p-8 h-full flex flex-col">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
            // O firme
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            Enterprise-level <span className="text-primary">development</span>
          </h3>
          <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
            Dodávame technicky náročné enterprise riešenia s presnou architektúrou, dôrazom na
            škálovateľnosť, kvalitu a budúci rozvoj. Žiadne hacky, žiadne „nejak to pôjde".
            Systémy, ktoré držia aj pod tlakom.
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4 flex-1">
            {pillars.map((p) => (
              <div
                key={p.code}
                className="wire-border bg-[hsl(var(--wire-bg-soft))] p-4 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                    {p.code}
                  </span>
                  <span className="font-mono text-xs text-primary">+</span>
                </div>
                <div className="text-base font-bold tracking-tight">{p.title}</div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-dashed border-[hsl(var(--wire-line))] flex items-center justify-between gap-3 flex-wrap">
            <div className="font-mono text-[11px] text-muted-foreground tracking-wider">
              // bezpečnosť × architektúra = systém, ktorý vydrží aj pod tlakom
            </div>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
              ● ACTIVE PARTNERSHIP
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
);
