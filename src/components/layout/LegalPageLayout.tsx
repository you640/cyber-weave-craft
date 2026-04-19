import { PageShell } from "./PageShell";
import { SectionMarker } from "@/components/landing/WireAnnotation";

interface LegalSection {
  id: string;
  num: string;
  title: string;
  body: React.ReactNode;
}

interface LegalPageLayoutProps {
  marker: { num: string; label: string };
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  metaTitle: string;
  metaDescription: string;
}

export const LegalPageLayout = ({
  marker,
  title,
  intro,
  updated,
  sections,
  metaTitle,
  metaDescription,
}: LegalPageLayoutProps) => (
  <PageShell title={metaTitle} description={metaDescription}>
    <SectionMarker num={marker.num} label={marker.label} />
    <header className="mb-10 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
      <p className="text-base text-muted-foreground leading-relaxed">{intro}</p>
      <div className="mt-4 inline-block wire-border bg-[hsl(var(--wire-bg-soft))] px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
        {updated}
      </div>
    </header>

    <div className="grid lg:grid-cols-[240px_1fr] gap-10">
      <aside className="hidden lg:block">
        <div className="sticky top-28 wire-border bg-[hsl(var(--wire-bg-soft))] p-4">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
            Obsah
          </div>
          <ul className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="font-mono text-xs hover:text-primary transition-colors block"
                >
                  {s.num}. {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <article className="space-y-10 max-w-3xl">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-28">
            <h2 className="text-2xl font-bold mb-4 flex items-baseline gap-3">
              <span className="font-mono text-sm text-primary">{s.num}.</span>
              {s.title}
            </h2>
            <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed space-y-3 [&_p]:text-sm [&_li]:text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:font-semibold">
              {s.body}
            </div>
          </section>
        ))}
      </article>
    </div>
  </PageShell>
);
