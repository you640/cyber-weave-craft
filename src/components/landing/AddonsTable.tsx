import { SectionMarker } from "./WireAnnotation";

const addons = [
  { name: "DNS / DNSSEC audit", desc: "DNS záznamy, SPF/DKIM/DMARC, DNSSEC setup", price: "149 €" },
  { name: "SSL/TLS certificate management", desc: "Let's Encrypt automatizácia, wildcard, certbot renewal", price: "99 €" },
  { name: "Backup stratégia + recovery test", desc: "3-2-1 backup, automatizácia, overenie obnovy", price: "249 €" },
  { name: "Security awareness training", desc: "2h workshop (phishing, heslá, social engineering)", price: "390 €" },
  { name: "Phishing simulácia", desc: "Kontrolovaná kampaň + click-rate report + training", price: "490 €" },
  { name: "Dark web monitoring (3 mes.)", desc: "Sledovanie únikov firemných údajov a hesiel", price: "290 €" },
  { name: "Mobile app security review", desc: "iOS/Android (OWASP Mobile Top 10, reverse eng.)", price: "690 €" },
  { name: "Cloud IAM audit (AWS/GCP/Azure)", desc: "IAM rolí, policies, least-privilege, MFA", price: "590 €" },
  { name: "Expresná priorita (48h)", desc: "Skrátenie dodania na 48 hodín (podľa dostupnosti)", price: "+50 %" },
];

export const AddonsTable = () => (
  <section id="doplnky" className="mt-28 scroll-mt-24">
    <SectionMarker num="03" label="Doplnky" />
    <div className="mb-10">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
        Samostatné <span className="italic font-light text-primary">moduly</span> pre konkrétne problémy
      </h2>
      <p className="mt-3 text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed">
        Niektoré firmy nepotrebujú celý balík. Potrebujú vyriešiť jednu slabinu skôr, než si ju všimne ešte niekto ďalší — bez povinnej kúpy polovičky tanku.
      </p>
    </div>

    <div className="wire-border bg-background overflow-hidden">
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1.5fr_2fr_auto] gap-4 px-5 py-3 border-b border-dashed border-[hsl(var(--wire-line))] bg-[hsl(var(--wire-bg-soft))] font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
        <div>Služba</div>
        <div className="hidden md:block">Popis</div>
        <div className="text-right">Cena</div>
      </div>

      {addons.map((a, i) => (
        <div
          key={a.name}
          className="grid grid-cols-[1fr_auto] md:grid-cols-[1.5fr_2fr_auto] gap-4 px-5 py-4 border-b border-dashed border-[hsl(var(--wire-line))] last:border-b-0 hover:bg-[hsl(var(--wire-bg-soft))] transition-colors items-start"
        >
          <div className="flex gap-3">
            <span className="font-mono text-[10px] text-muted-foreground mt-0.5 hidden sm:inline">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="font-medium text-sm">{a.name}</div>
              <div className="text-xs text-muted-foreground mt-1 md:hidden">{a.desc}</div>
            </div>
          </div>
          <div className="hidden md:block text-xs text-muted-foreground leading-relaxed">{a.desc}</div>
          <div className="font-mono text-sm font-bold text-primary text-right whitespace-nowrap self-center">{a.price}</div>
        </div>
      ))}
    </div>
  </section>
);
