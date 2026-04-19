import { PageShell } from "@/components/layout/PageShell";
import { SectionMarker } from "@/components/landing/WireAnnotation";
import { useState } from "react";

const cases = [
  {
    industry: "eshop",
    tag: "ESHOP · KOZMETIKA",
    problem: "Botnet s 4 200 IP adries denne mlátil do admin loginu. Server padal pod záťažou.",
    solution: "Cloudflare WAF + custom rate-limit + 2FA pre admin. Geofencing mimo SK/CZ/AT.",
    metric: "−97% brute-force pokusov za 30 dní",
  },
  {
    industry: "saas",
    tag: "B2B SAAS · HR TECH",
    problem: "Audit pred Series A. Investor požadoval SOC2-ready posudok do 4 týždňov.",
    solution: "Threat model, pentest, RBAC review, secrets rotation, SIEM setup, dokumentácia.",
    metric: "Investícia uzavretá v termíne",
  },
  {
    industry: "korporat",
    tag: "BOOKING · HOTELIERSTVO",
    problem: "Padajúci rezervačný systém v sezóne. Žiadne logy, žiadny monitoring, žiadne zálohy.",
    solution: "Observability stack, automatické zálohy s test-restore, runbook pre on-call.",
    metric: "0 výpadkov za nasledujúcu sezónu",
  },
  {
    industry: "korporat",
    tag: "MÉDIÁ · ONLINE NOVINY",
    problem: "DDoS útok počas volebnej noci. Stránka nedostupná 6 hodín, strata reklamných výnosov.",
    solution: "Anycast CDN, scrubbing, automatické failover. Incident playbook pre redakciu.",
    metric: "Odolali 380 Gbps útoku v ďalších voľbách",
  },
  {
    industry: "saas",
    tag: "FINTECH · LENDING",
    problem: "Credential stuffing — útočníci skúšali hesla z LinkedIn úniku na klientskom portáli.",
    solution: "Have-I-Been-Pwned check pri logine, device fingerprinting, behaviorálna detekcia.",
    metric: "12 800 zablokovaných pokusov / mesiac",
  },
  {
    industry: "korporat",
    tag: "HEALTHCARE · KLINIKA",
    problem: "GDPR audit našiel zdravotné záznamy v plain texte v starej DB. Riziko 4% pokuty.",
    solution: "Field-level encryption, access log, DPIA, školenie personálu, DPA s dodávateľmi.",
    metric: "Audit prešiel bez nálezu v retesteu",
  },
];

const filters = [
  { id: "all", label: "Všetky" },
  { id: "eshop", label: "Eshop" },
  { id: "saas", label: "SaaS" },
  { id: "korporat", label: "Korporát" },
];

const CaseStudiesPage = () => {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? cases : cases.filter((c) => c.industry === active);

  return (
    <PageShell
      title="Case studies · Reálne projekty | Nexify"
      description="Anonymizované príbehy klientov: eshopy, SaaS, fintech, healthcare. Konkrétne problémy, riešenia a merateľné výsledky."
    >
      <SectionMarker num="PROOF · 02" label="Case studies" />

      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Reálne projekty, reálne čísla.
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Mená klientov nezverejňujeme — bezpečnosť je dôvera. Ale problémy a výsledky sú skutočné.
          Niektoré z nich vám možno znejú povedome.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={`font-mono text-xs px-3 py-2 transition-colors ${
              active === f.id
                ? "bg-primary text-primary-foreground wire-border-solid"
                : "wire-border hover:bg-[hsl(var(--wire-bg-soft))]"
            }`}
          >
            [ {f.label} ]
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {visible.map((c, i) => (
          <article key={i} className="wire-border-solid bg-background p-6 wire-shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-[0.2em] bg-[hsl(var(--wire-bg-soft))] px-2 py-1 wire-border">
                {c.tag}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">CASE #{String(i + 1).padStart(3, "0")}</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
                  Problém
                </div>
                <p className="text-sm leading-relaxed">{c.problem}</p>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
                  Riešenie
                </div>
                <p className="text-sm leading-relaxed">{c.solution}</p>
              </div>
              <div className="pt-4 border-t border-dashed border-[hsl(var(--wire-line))]">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
                  Výsledok
                </div>
                <p className="text-lg font-semibold text-primary">{c.metric}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
};

export default CaseStudiesPage;
