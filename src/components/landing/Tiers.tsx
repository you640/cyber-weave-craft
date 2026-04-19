import { SectionMarker, WireAnnotation, WireArrow } from "./WireAnnotation";
import { cn } from "@/lib/utils";

const tiers = [
  {
    code: "T_01",
    name: "Essentials",
    target: "SME / živnostníci / malé weby",
    price: "249",
    note: "jednorazovo · bez DPH",
    cta: "Objednať audit",
    features: [
      "Security audit logov — 7 dní nginx/Apache",
      "WordPress hardening basic (xmlrpc, wp-login)",
      "TLS/SSL check — HSTS, TLS 1.3",
      "PDF report — 10–15 strán",
      "Implementačný návod (nginx snippety)",
      "E-mailová podpora 7 dní",
    ],
  },
  {
    code: "T_02",
    name: "Professional",
    target: "Firmy 10–50 / SaaS / e-shopy",
    price: "1 290",
    note: "jednorazovo · bez DPH",
    cta: "Objednať Professional",
    popular: true,
    features: [
      "Všetko z balíka Essentials",
      "Pentest aplikácie — OWASP Top 10",
      "Server hardening (SSH, fw, fail2ban)",
      "WAF deployment (Cloudflare / ModSec)",
      "Monitoring setup (Grafana + Loki)",
      "GDPR audit — cookies, retention, DPA",
      "Incident response plan + runbook",
      "30 dní support + 1 konzultácia",
    ],
  },
  {
    code: "T_03",
    name: "Shield",
    target: "Agentúry / SaaS >10k / fintech",
    price: "3 890",
    note: "jednorazovo + retainer · bez DPH",
    cta: "Objednať Shield",
    features: [
      "Všetko z balíka Professional",
      "Hĺbkový pentest — black/grey box, API fuzz",
      "DevSecOps — Supabase RLS, JWT, secrets",
      "Infra audit — AWS/Vercel, IAM, network",
      "Source code review (SAST + manual)",
      "NIS2 / ISO 27001 alignment",
      "24/7 incident response SLA (retainer)",
      "90 dní support + mesačný sync",
    ],
  },
];

export const Tiers = () => (
  <section id="balíčky" className="mt-28 scroll-mt-24">
    <SectionMarker num="01" label="Balíčky" />
    <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
      <div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Tri úrovne <span className="italic font-light text-primary">ochrany</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed">
          Od jednorazového auditu pre živnostníkov až po kontinuálny retainer pre enterprise klientov. Každý balík je samostatne objednateľný.
        </p>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <WireAnnotation rotate={-3}>fixné ceny, žiadne prekvapenia</WireAnnotation>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-5">
      {tiers.map((t) => (
        <div
          key={t.code}
          className={cn(
            "relative wire-border bg-background p-6 md:p-8 flex flex-col transition-all hover:-translate-y-1",
            t.popular && "wire-border-solid wire-shadow-primary",
          )}
        >
          {t.popular && (
            <>
              <div className="absolute -top-3 left-6 bg-primary text-primary-foreground font-mono text-[10px] tracking-[0.2em] px-2 py-1">
                ★ POPULAR
              </div>
              <div className="absolute -right-4 top-12 hidden lg:flex flex-col items-start">
                <WireArrow className="w-14" />
                <WireAnnotation rotate={6} className="text-xl -mt-1">vyber tento</WireAnnotation>
              </div>
            </>
          )}

          <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
            Tier · {t.code}
          </div>
          <h3 className="text-3xl font-bold tracking-tight">{t.name}</h3>
          <p className="font-mono text-xs text-muted-foreground mt-1">{t.target}</p>

          <div className="mt-6 pb-6 border-b border-dashed border-[hsl(var(--wire-line))]">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl font-bold">{t.price}</span>
              <span className="font-mono text-xl text-muted-foreground">€</span>
            </div>
            <div className="font-mono text-[11px] text-muted-foreground mt-1">{t.note}</div>
          </div>

          <ul className="mt-5 space-y-2.5 flex-1">
            {t.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm leading-snug">
                <span className="font-mono text-xs text-primary mt-0.5 shrink-0">[✓]</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button
            className={cn(
              "mt-6 w-full font-mono text-xs py-3 transition-all",
              t.popular
                ? "bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                : "wire-border hover:bg-foreground hover:text-background",
            )}
          >
            [ {t.cta} → ]
          </button>
        </div>
      ))}
    </div>
  </section>
);
