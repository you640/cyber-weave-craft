import { IconPlaceholder } from "./PlaceholderBox";
import { SectionMarker } from "./WireAnnotation";

const services = [
  {
    code: "SVC_01",
    title: "Audit logov & detekcia útokov",
    desc: "Analýza nginx / Apache / CDN logov za 7–30 dní. Identifikácia botnetov, brute-force, payload signatúr.",
    deliverables: ["PDF report s top threatami", "IP blocklist pre firewall", "Nginx config s ban rules", "Fail2ban jail templates"],
    price: "149",
    time: "2–3 dni",
  },
  {
    code: "SVC_02",
    title: "WordPress hardening & pentest",
    desc: "Komplet zabezpečenie WordPress. XML-RPC, rate-limit, CVE check pluginov, file permissions, .htaccess rules.",
    deliverables: ["Audit pluginov + CVE list", "Wordfence deployment", "Backup + recovery test", "2FA pre admin", "Brute-force ochrana"],
    price: "390",
    time: "3–5 dní",
  },
  {
    code: "SVC_03",
    title: "Server hardening + monitoring",
    desc: "Linux servers (Ubuntu/Debian). SSH kľúče, ufw/nftables, fail2ban, nginx TLS, update stratégia.",
    deliverables: ["Ansible playbook", "nginx.conf A+ rating", "Fail2ban jails", "Monitoring dashboard", "Dokumentácia"],
    price: "490",
    time: "3–7 dní",
  },
  {
    code: "SVC_04",
    title: "Incident response — emergency",
    desc: "Urgentná pomoc po kompromitácii. Identifikácia vektora, odstránenie malwaru, forenzná analýza, GDPR notifikácia.",
    deliverables: ["Triáž do 4 hodín", "Izolácia systémov", "Forenzný report", "Clean restoration", "GDPR notifikácia (72h)", "Post-mortem"],
    price: "890",
    time: "< 4 hodiny",
  },
  {
    code: "SVC_05",
    title: "GDPR & NIS2 compliance",
    desc: "Audit súladu so zákonom 18/2018, GDPR a NIS2. Dokumentácia, cookie banner, DPA, retention policy.",
    deliverables: ["Gap analýza", "Privacy policy + cookie banner", "DPA vzor", "Data retention matrix", "NIS2 self-assessment"],
    price: "590",
    time: "5–10 dní",
  },
  {
    code: "SVC_06",
    title: "DevSecOps pre SaaS",
    desc: "Audit SaaS stackov. Supabase RLS, JWT, API rate limiting, secret management, CI/CD security.",
    deliverables: ["RLS policy review", "JWT audit", "API rate-limit middleware", "Secrets leak scan (gitleaks)", "CI/CD hardening"],
    price: "790",
    time: "5–7 dní",
  },
  {
    code: "SVC_07",
    title: "Penetračné testovanie",
    desc: "Simulácia reálneho útoku. Black/grey/white box. OWASP Top 10, API fuzzing, auth bypass, privilege escalation.",
    deliverables: ["Executive summary", "Technický report s PoC", "CVSS skóre", "Remediation roadmap", "Re-test zdarma (30d)"],
    price: "1 490",
    time: "7–14 dní",
  },
  {
    code: "SVC_08",
    title: "WAF setup & tuning",
    desc: "Web Application Firewall. Cloudflare, AWS WAF, ModSecurity pre nginx, alebo self-hosted rules na mieru.",
    deliverables: ["Pravidlá pre OWASP Top 10", "Bot protection", "Rate limiting login/API", "Geo-blocking", "Dashboard + alerting"],
    price: "290",
    time: "2–4 dni",
  },
];

export const Services = () => (
  <section id="služby" className="mt-28 scroll-mt-24">
    <SectionMarker num="02" label="À la carte služby" />
    <div className="mb-10">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
        Samostatné <span className="font-display italic font-light text-primary">moduly</span>
      </h2>
      <p className="mt-3 text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed">
        Jednotlivé moduly pre firmy, ktoré potrebujú len špecifickú oblasť. Pri 3+ službách platí <span className="text-foreground font-medium">zľava 15 %</span>.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((s) => (
        <article key={s.code} className="wire-border bg-background p-5 flex flex-col hover:wire-shadow-sm transition-all">
          <div className="flex items-start justify-between gap-3 mb-3">
            <IconPlaceholder code={s.code.split("_")[1]} />
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{s.code}</span>
          </div>

          <h3 className="text-lg font-bold leading-tight tracking-tight">{s.title}</h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>

          <div className="mt-4 pt-3 border-t border-dashed border-[hsl(var(--wire-line))]">
            <div className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase mb-2">Výstup</div>
            <ul className="space-y-1 flex-1">
              {s.deliverables.map((d) => (
                <li key={d} className="flex gap-2 text-[11px] leading-snug">
                  <span className="font-mono text-muted-foreground shrink-0">[ ]</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-[hsl(var(--wire-line))] flex items-end justify-between gap-2">
            <div>
              <div className="font-mono text-[9px] text-muted-foreground tracking-[0.15em] uppercase">od</div>
              <div className="font-mono text-xl font-bold text-primary leading-none">
                {s.price}<span className="text-xs text-muted-foreground ml-0.5">€</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[9px] text-muted-foreground tracking-[0.1em] uppercase">Dodanie</div>
              <div className="font-mono text-xs font-medium mt-0.5">{s.time}</div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);
