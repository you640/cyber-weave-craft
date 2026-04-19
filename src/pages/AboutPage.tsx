import { PageShell } from "@/components/layout/PageShell";
import { SectionMarker } from "@/components/landing/WireAnnotation";
import { Link } from "react-router-dom";

const team = [
  { code: "CEO", name: "Founder & Lead Auditor", bio: "10+ rokov v offensive security. Bývalý red-teamer pre fintech a telco." },
  { code: "SEC", name: "Security Engineer", bio: "Špecialista na WAF, EDR a SIEM. OSCP, CRTP. Pôvodne backend developer." },
  { code: "OPS", name: "DevOps & IR Lead", bio: "Incident response veterán. Zvláda nočné výpadky aj komunikáciu s políciou." },
];

const stats = [
  { num: "10+", label: "Rokov v cybersec" },
  { num: "180+", label: "Auditov dodaných" },
  { num: "60+", label: "Aktívnych klientov" },
  { num: "24/7", label: "Incident response" },
];

const AboutPage = () => (
  <PageShell
    title="O nás · Nezávislý cybersec butik | Nexify"
    description="Sme nezávislý cybersec butik z Bratislavy. Audit, pentest, WAF a 24/7 strážna služba pre eshopy, weby a aplikácie."
  >
    <SectionMarker num="COMPANY · 01" label="O nás" />

    <header className="mb-12 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        Nezávislý cybersec butik z Bratislavy.
      </h1>
      <p className="text-lg text-muted-foreground leading-relaxed">
        Sme malý tím s veľkou skúsenosťou. Robíme to, čo veľké agentúry sľubujú a outsourcujú —
        len my to robíme sami a poznáme každý riadok logu, ktorý vám pošleme.
      </p>
    </header>

    <div className="grid md:grid-cols-3 gap-6 mb-16">
      {[
        {
          h: "Príbeh",
          p: 'Začali sme v 2019 ako dvaja kamaráti z bug bounty komunity. Mali sme dosť toho, ako veľké firmy predávajú „bezpečnosť" v PowerPointe. Chceli sme robiť technickú prácu, nie reporty pre reporty.',
        },
        {
          h: "Misia",
          p: 'Slovenské a české firmy si zaslúžia rovnakú úroveň ochrany ako bratislavské banky. Bez korporátnej byrokracie, bez minimálnych ročných kontraktov, bez „call your account manager".',
        },
        {
          h: "Prístup",
          p: "Hovoríme po lopate. Reportujeme len to, čo vieme reprodukovať. Nehrozíme. Neodporúčame to, čo nepoužívame sami. Keď nevieme, povieme vám to.",
        },
      ].map((c) => (
        <div key={c.h} className="wire-border bg-[hsl(var(--wire-bg-soft))] p-6">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-3">
            {c.h}
          </div>
          <p className="text-sm leading-relaxed">{c.p}</p>
        </div>
      ))}
    </div>

    <section className="mb-16">
      <SectionMarker num="TEAM · 02" label="Kto je za tým" />
      <div className="grid md:grid-cols-3 gap-6">
        {team.map((m) => (
          <div key={m.code} className="wire-border-solid p-6 wire-shadow-sm">
            <div className="w-16 h-16 wire-border bg-[hsl(var(--wire-bg-soft))] flex items-center justify-center mb-4">
              <span className="font-mono text-xs text-[hsl(var(--wire-line-strong))]">{m.code}</span>
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
              [ člen tímu ]
            </div>
            <h3 className="text-lg font-semibold mb-2">{m.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-16">
      <SectionMarker num="METHOD · 03" label="Metodológia & zdroje dát" />
      <div className="wire-border-solid p-6 md:p-8 wire-shadow-sm bg-background">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-4">
          Autoritatívne zdroje, opakovateľné výsledky
        </h3>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
          Pri mapovaní a hodnotení zraniteľností používame obohatené záznamy z{" "}
          <strong className="text-foreground">NVD (NIST)</strong> — CVE list, CVSS skóre, CWE
          kategórie a CPE aplikovateľnosť. Výsledky z NVD kombinujeme s{" "}
          <strong className="text-foreground">MITRE ATT&CK</strong> (TTPs),{" "}
          <strong className="text-foreground">CISA KEV</strong> (aktívne zneužívané CVE) a{" "}
          <strong className="text-foreground">EPSS</strong> (pravdepodobnosť zneužitia).
        </p>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          NVD používame ako referenčný zdroj na obohatenie a koreláciu — finálne hodnotenie
          nikdy nevychádza výlučne z verejných databáz. Vždy ho kombinujeme s internými dátami,
          lokálnou cache a manuálnym overením v kontexte konkrétneho prostredia klienta. Tým
          dosahujeme spoľahlivé a opakovateľné vyhodnotenia.
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          {["NVD / NIST", "MITRE ATT&CK", "CISA KEV", "EPSS / FIRST.org", "CVE · CVSS · CWE · CPE"].map(
            (t) => (
              <span
                key={t}
                className="font-mono text-[10px] tracking-[0.15em] uppercase px-2 py-1 wire-border bg-[hsl(var(--wire-bg-soft))]"
              >
                {t}
              </span>
            ),
          )}
        </div>
      </div>
    </section>

    <section className="mb-16 wire-border bg-[hsl(var(--wire-bg-soft))] p-8">
      <SectionMarker num="NUMBERS · 04" label="V číslach" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{s.num}</div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>

    <div className="flex flex-wrap gap-3">
      <Link
        to="/kontakt"
        className="font-mono text-xs px-4 py-3 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
      >
        Kontaktovať nás →
      </Link>
      <Link to="/case-studies" className="font-mono text-xs px-4 py-3 wire-border">
        Pozrieť case studies
      </Link>
    </div>
  </PageShell>
);

export default AboutPage;
