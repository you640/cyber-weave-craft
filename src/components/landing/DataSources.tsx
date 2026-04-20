import { SectionMarker } from "./WireAnnotation";

const sources = [
  {
    code: "SRC_01",
    name: "NVD / NIST",
    tag: "CVE · CVSS · CWE · CPE",
    desc: "Národný register zraniteľností (NIST). Autoritatívny zdroj štandardizovaných informácií o zraniteľnostiach a ich hodnotení.",
    url: "https://nvd.nist.gov",
    host: "nvd.nist.gov",
  },
  {
    code: "SRC_02",
    name: "MITRE ATT&CK",
    tag: "TTPs · threat modeling",
    desc: "Framework pre taktiky, techniky a postupy útočníkov. Používame na mapovanie reálnych útokov a threat modeling.",
    url: "https://attack.mitre.org",
    host: "attack.mitre.org",
  },
  {
    code: "SRC_03",
    name: "CISA KEV",
    tag: "known exploited vulns",
    desc: "Katalóg aktívne zneužívaných zraniteľností od US CISA. Prioritizuje, čo treba opraviť ako prvé.",
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    host: "cisa.gov",
  },
  {
    code: "SRC_04",
    name: "EPSS · FIRST.org",
    tag: "exploit probability",
    desc: "Exploit Prediction Scoring System. Pravdepodobnosť zneužitia konkrétneho CVE v najbližších 30 dňoch.",
    url: "https://www.first.org/epss/",
    host: "first.org",
  },
];

export const DataSources = () => (
  <section id="data-sources" className="mt-28 scroll-mt-24">
    <SectionMarker num="09" label="Data sources" />

    <div className="mb-10 max-w-3xl">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
        Neveštíme z kryštálu. Pracujeme s <span className="italic font-light text-primary">dátami</span>.
      </h2>
      <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
        Naše analýzy nestoja na dojmoch, ale na kombinácii referenčných bezpečnostných zdrojov, interných signálov a reálneho overenia vo vašom prostredí.
      </p>
      <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed">
        NVD/NIST, MITRE ATT&amp;CK, CISA KEV a EPSS pre nás nie sú ozdoby do prezentácie. Sú to orientačné body, podľa ktorých vieme rýchlejšie rozlíšiť, čo je teoretická zraniteľnosť a čo je problém, ktorý si treba všimnúť skôr než útočník.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {sources.map((s) => (
        <a
          key={s.code}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="wire-border bg-background p-5 hover:bg-[hsl(var(--wire-bg-soft))] transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              {s.code}
            </span>
            <span className="font-mono text-[10px] text-primary opacity-60 group-hover:opacity-100">
              ↗
            </span>
          </div>
          <h3 className="text-lg font-bold tracking-tight mb-1">{s.name}</h3>
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-primary mb-3">
            {s.tag}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.desc}</p>
          <div className="font-mono text-[10px] text-muted-foreground tracking-wider">
            {s.host}
          </div>
        </a>
      ))}
    </div>

    <p className="mt-6 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
      [ public reference data · bez prenosu klientskych PII ]
    </p>
  </section>
);
