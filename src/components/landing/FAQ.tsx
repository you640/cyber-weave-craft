import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionMarker } from "./WireAnnotation";

const faqs = [
  {
    q: "Aký je rozdiel medzi auditom a pentestom?",
    a: "Audit je analytická kontrola (konfigurácie, logy, dokumentácia) — pasívna, bez útokov na systém. Pentest je aktívna simulácia reálneho útoku, kde sa pokúšame systém prelomiť v kontrolovanom prostredí. Audit zodpovedá otázku „máme správne nastavené bezpečnostné politiky?“, pentest „dokáže niekto tieto politiky obísť?“",
  },
  {
    q: "Sú ceny fixné alebo sa môžu zvýšiť počas projektu?",
    a: "Pri balíkoch a štandardných službách sú ceny fixné. Pri väčších projektoch (Enterprise Shield, custom pentest) sa po úvodnom scope calle dohodne cena vopred a nemení sa. Žiadne skryté poplatky.",
  },
  {
    q: "Dávate záruku na nájdenie zraniteľností?",
    a: "Neexistuje 100 % bezpečný systém, takže záruku „nič vám nenájdeme“ nedávame. Garantujeme však dôkladnosť procesu podľa OWASP / NIST metodík a v prípade pentestu zahŕňame bezplatný re-test po oprave (30 dní).",
  },
  {
    q: "Ako prebieha urgentný incident response?",
    a: "Napíšete na núdzovú e-mailovú adresu alebo zavoláte. Do 4 hodín (pri Fortress retainery do 1 hodiny) začneme triáž — identifikujeme rozsah útoku, izolujeme postihnuté systémy a začneme obnovu. Komunikácia je priebežná cez dohodnutý kanál (Slack/Signal).",
  },
  {
    q: "Fakturujete s DPH?",
    a: "Všetky ceny v cenníku sú uvedené bez DPH. Faktúry sú slovenské, splatné 14 dní, možnosť SEPA prevodu. Pri retaineroch mesačná fakturácia vopred.",
  },
  {
    q: "Pracujete aj so zahraničnými klientmi?",
    a: "Áno, pracujeme v SK, CZ a EN. Faktúry vieme vystaviť v EUR aj s reverse-charge mechanizmom pre EÚ firmy. Pri US/UK klientoch individuálna dohoda.",
  },
  {
    q: "Čo presne robíte cez víkendy a sviatky?",
    a: "To isté čo cez týždeň. Naše monitoringy bežia nonstop a inžinier v službe má zapnutý telefón aj na Štedrý večer. Pri Ochranca a Telochranca balíčkoch máte garantovanú reakciu do 4, resp. 1 hodiny — bez ohľadu na deň, čas alebo to, či je 31. december.",
  },
  {
    q: "Môj eshop je malý — oplatí sa mi to?",
    a: "Práve malé eshopy sú najčastejším cieľom, lebo útočníci vedia, že nemajú IT oddelenie. Balík Strážny (249 €) zachytí 90 % útokov, ktoré dnes na malé weby reálne lietajú. Ak vám eshop generuje viac ako 1 000 € mesačne, jeden hacknutý víkend stojí viac než ročná ochrana.",
  },
  {
    q: "Koľko ma bude stáť hacknutý web vs. vaša služba?",
    a: "Priemerný incident pri eshope (čistenie, obnova zo záloh, pokuta GDPR, strata reputácie, výpadok predaja) stojí 8 000 – 50 000 €. Naša ročná strážna služba začína od 1 200 €. Matematika je jednoduchá — radšej zaplatíte ochrancu než opravára.",
  },
  {
    q: "Aký je rozdiel medzi vami a hostingom (napr. Websupport)?",
    a: "Hosting vám prenajíma server a stará sa, aby bežal. My sa staráme, aby na ňom nikto nerobil neporiadok. Hosting vás upozorní, keď server padne. My vás upozorníme, keď sa o to niekto pokúša — a útok zastavíme skôr, než sa dotkne hostingu.",
  },
];

export const FAQ = () => (
  <section id="faq" className="mt-28 scroll-mt-24">
    <SectionMarker num="05" label="Časté otázky" />
    <div className="mb-10 max-w-3xl">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
        FAQ — <span className="font-display italic font-light text-primary">priamo, vecne, bez omáčky</span>
      </h2>
      <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
        Bez dymovej clony. Bez sales poézie. Bez toho, aby vám niekto vysvetľoval, že incident je vlastne príležitosť. Nie je. Je to incident.
      </p>
    </div>

    <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
      <div className="hidden lg:block">
        <div className="wire-border p-6 bg-[hsl(var(--wire-bg-soft))] sticky top-28">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">Stále nejasné?</div>
          <p className="text-sm leading-relaxed mb-5">
            Napíš nám priamo. Odpovedáme do 24 hodín v pracovných dňoch — bez sales bullshitu.
          </p>
          <button className="w-full font-mono text-xs py-3 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
            [ Napísať e-mail → ]
          </button>
          <div className="mt-4 font-mono text-[11px] text-muted-foreground">
            hello@nexify-studio.tech
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="wire-border bg-background px-5 border-b-[1.5px]"
          >
            <AccordionTrigger className="text-left font-medium text-base hover:no-underline py-5 [&[data-state=open]>span.plus]:rotate-45 [&>svg]:hidden">
              <span className="flex items-center gap-3 flex-1">
                <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{String(i + 1).padStart(2, "0")}</span>
                <span>{f.q}</span>
              </span>
              <span className="plus font-mono text-xl text-primary font-light transition-transform shrink-0 ml-3">+</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 pl-10">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
