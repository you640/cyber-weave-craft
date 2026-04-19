import { PageShell } from "@/components/layout/PageShell";
import { SectionMarker } from "@/components/landing/WireAnnotation";

const posts = [
  {
    date: "12. 04. 2026",
    cat: "WORDPRESS",
    title: "Kritické CVE v populárnom WP plugine — čo robiť hneď",
    lead: "Tento týždeň vyšiel patch pre RCE zraniteľnosť v plugine s 5+ miliónmi inštalácií. Ukazujeme, ako rýchlo zistiť, či vás to ovplyvňuje a čo urobiť, ak nemôžete updatovať okamžite.",
  },
  {
    date: "05. 04. 2026",
    cat: "REGULÁCIA",
    title: "NIS2 v praxi: koho sa to fakt týka a čo treba mať pripravené",
    lead: "NIS2 začala platiť, ale väčšina malých a stredných firiem stále nevie, či ich povinnosti zasahujú. Praktický decision tree v 6 otázkach a checklist minimálnych opatrení.",
  },
  {
    date: "28. 03. 2026",
    cat: "INCIDENT",
    title: "Post-mortem: ako sme za 47 minút zastavili ransomware v eshopu",
    lead: "Klient nás zavolal o 2:14 ráno. O 3:01 bolo všetko izolované, zálohy overené a backup-strategia spustená. Detailný timeline, čo sme robili a aké chyby sme sa naučili.",
  },
  {
    date: "20. 03. 2026",
    cat: "GDPR",
    title: "10 najčastejších otázok o GDPR od majiteľov eshopov",
    lead: "Cookie banner stačí? Treba DPO? Čo s analytikou? Odpovedáme bez právničiny na otázky, ktoré dostávame v každom kick-off mítingu.",
  },
  {
    date: "14. 03. 2026",
    cat: "INFRA",
    title: "Cloudflare WAF od nuly: pravidlá, ktoré chytajú 90% bot trafficu",
    lead: "Konkrétne expression rules, ktoré nasadzujeme klientom v prvý deň. Copy-paste konfigurácia + vysvetlenie, prečo každé pravidlo existuje.",
  },
  {
    date: "07. 03. 2026",
    cat: "SUPABASE",
    title: "Row Level Security v Supabase: 5 chýb, ktoré sme videli v auditoch",
    lead: "RLS je mocný nástroj, ale ľahko ho urobíte zle. Ukazujeme reálne príklady policies, ktoré vyzerajú správne a pritom nechávajú dáta otvorené.",
  },
];

const categories = ["WORDPRESS", "REGULÁCIA", "INCIDENT", "GDPR", "INFRA", "SUPABASE"];
const tags = ["#waf", "#wordpress", "#nis2", "#gdpr", "#supabase", "#cloudflare", "#ddos", "#pentest", "#incident-response"];

const BlogPage = () => (
  <PageShell
    title="Blog · Cybersec poznámky z praxe | Nexify"
    description="Praktické články o webovej bezpečnosti, GDPR, NIS2, WordPress, Cloudflare a incident response. Z reálnych auditov, bez marketingu."
  >
    <SectionMarker num="JOURNAL · 03" label="Blog" />

    <header className="mb-10 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Poznámky z praxe.
      </h1>
      <p className="text-base text-muted-foreground leading-relaxed">
        Píšeme o tom, čo vidíme v auditoch a incidentoch. Žiadne všeobecné top-10 listy,
        žiadne re-publikované novinky — len konkrétne veci, ktoré sa nám stali alebo ktoré opravujeme klientom.
      </p>
    </header>

    <div className="grid lg:grid-cols-[1fr_240px] gap-10">
      <div className="grid sm:grid-cols-2 gap-6">
        {posts.map((p, i) => (
          <article key={i} className="wire-border-solid p-6 wire-shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-[0.2em] bg-[hsl(var(--wire-bg-soft))] px-2 py-1 wire-border">
                {p.cat}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">{p.date}</span>
            </div>
            <h3 className="text-lg font-semibold mb-3 leading-tight">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{p.lead}</p>
            <a href="#" className="font-mono text-xs text-primary hover:underline mt-auto">
              čítať celý článok →
            </a>
          </article>
        ))}
      </div>

      <aside className="space-y-6">
        <div className="wire-border bg-[hsl(var(--wire-bg-soft))] p-4">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
            Kategórie
          </div>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c}>
                <a href="#" className="font-mono text-xs hover:text-primary transition-colors">
                  // {c}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="wire-border bg-[hsl(var(--wire-bg-soft))] p-4">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
            Tagy
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <a
                key={t}
                href="#"
                className="font-mono text-[10px] wire-border bg-background px-2 py-1 hover:text-primary transition-colors"
              >
                {t}
              </a>
            ))}
          </div>
        </div>

        <div className="wire-border-solid bg-primary text-primary-foreground p-4">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2 opacity-80">
            Newsletter
          </div>
          <p className="text-xs leading-relaxed mb-3">1× mesačne. Bez spamu. Iba reálne CVE a poznámky z auditov.</p>
          <input
            type="email"
            placeholder="email@firma.sk"
            className="w-full bg-background text-foreground px-2 py-1.5 text-xs font-mono mb-2"
          />
          <button className="w-full bg-background text-foreground font-mono text-xs px-2 py-1.5">
            Prihlásiť →
          </button>
        </div>
      </aside>
    </div>
  </PageShell>
);

export default BlogPage;
