import { PageShell } from "@/components/layout/PageShell";
import { SectionMarker } from "@/components/landing/WireAnnotation";

const cookies = [
  { name: "session_id", purpose: "Udržanie prihlásenia v zákazníckom portáli", duration: "Session", type: "Nutné" },
  { name: "csrf_token", purpose: "Ochrana pred CSRF útokmi", duration: "Session", type: "Nutné" },
  { name: "cookie_consent", purpose: "Zapamätanie vašej voľby cookies", duration: "12 mesiacov", type: "Nutné" },
  { name: "_pa_uid", purpose: "Anonymná návštevnosť (Plausible Analytics)", duration: "24 hodín", type: "Analytické" },
  { name: "_pa_ses", purpose: "Detekcia opakovaných návštev v session", duration: "30 minút", type: "Analytické" },
  { name: "lang", purpose: "Preferovaný jazyk webu", duration: "12 mesiacov", type: "Funkčné" },
];

const typeColor = (t: string) => {
  if (t === "Nutné") return "bg-foreground text-background";
  if (t === "Analytické") return "bg-primary text-primary-foreground";
  return "wire-border bg-[hsl(var(--wire-bg-soft))]";
};

const CookiesPage = () => (
  <PageShell
    title="Cookie Policy · Aké cookies používame | Nexify"
    description="Zoznam cookies, ich účel, doba platnosti a ako ich spravovať. Analytics je anonymná, žiadne marketingové cookies tretích strán."
  >
    <SectionMarker num="LEGAL · COOKIES" label="Cookie Policy" />

    <header className="mb-10 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Cookies — po lopate.</h1>
      <p className="text-base text-muted-foreground leading-relaxed">
        Používame minimum cookies. Žiadny Google Analytics, žiadny Facebook Pixel, žiadne marketing trackery tretích strán. Anonymná návštevnosť cez self-hosted Plausible.
      </p>
      <div className="mt-4 inline-block wire-border bg-[hsl(var(--wire-bg-soft))] px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
        Platné od 19. 4. 2026
      </div>
    </header>

    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Čo je cookie?</h2>
      <p className="text-sm leading-relaxed text-foreground/90 max-w-3xl">
        Cookie je malý textový súbor, ktorý web uloží vo vašom prehliadači. Slúži na zapamätanie nastavení (jazyk, prihlásenie) alebo na anonymné meranie návštevnosti. Nie sú to programy, nemôžu vás „nakaziť" ani čítať vaše súbory.
      </p>
    </section>

    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Aké cookies používame</h2>
      <div className="wire-border-solid overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--wire-bg-soft))] border-b-[1.5px] border-foreground">
            <tr>
              <th className="text-left p-3 font-mono text-[10px] tracking-[0.2em] uppercase">Názov</th>
              <th className="text-left p-3 font-mono text-[10px] tracking-[0.2em] uppercase">Účel</th>
              <th className="text-left p-3 font-mono text-[10px] tracking-[0.2em] uppercase">Doba platnosti</th>
              <th className="text-left p-3 font-mono text-[10px] tracking-[0.2em] uppercase">Typ</th>
            </tr>
          </thead>
          <tbody>
            {cookies.map((c) => (
              <tr key={c.name} className="border-b border-dashed border-[hsl(var(--wire-line))]">
                <td className="p-3 font-mono text-xs">{c.name}</td>
                <td className="p-3">{c.purpose}</td>
                <td className="p-3 font-mono text-xs">{c.duration}</td>
                <td className="p-3">
                  <span className={`font-mono text-[10px] tracking-wide px-2 py-1 ${typeColor(c.type)}`}>
                    {c.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section className="mb-12 grid md:grid-cols-3 gap-6">
      {[
        { h: "Nutné", p: "Bez nich web nefunguje (login, bezpečnosť). Nedá sa ich vypnúť." },
        { h: "Analytické", p: "Anonymné. Pomáhajú nám vidieť, ktoré stránky ľudia čítajú. Plausible, self-hosted v EU." },
        { h: "Funkčné", p: "Zapamätanie preferencií ako jazyk. Bez nich web funguje, len menej pohodlne." },
      ].map((c) => (
        <div key={c.h} className="wire-border bg-[hsl(var(--wire-bg-soft))] p-5">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-2">{c.h}</div>
          <p className="text-sm leading-relaxed">{c.p}</p>
        </div>
      ))}
    </section>

    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Ako cookies spravovať</h2>
      <p className="text-sm leading-relaxed text-foreground/90 max-w-3xl mb-4">
        V každom prehliadači viete cookies vypnúť, vymazať alebo blokovať jednotlivo. Návody:
      </p>
      <ul className="text-sm space-y-2 max-w-3xl">
        <li>• <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
        <li>• <a href="https://support.mozilla.org/sk/kb/povolenie-zakazanie-cookies" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
        <li>• <a href="https://support.apple.com/sk-sk/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
        <li>• <a href="https://support.microsoft.com/en-us/microsoft-edge" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
      </ul>
    </section>

    <div className="wire-border-solid bg-[hsl(var(--wire-bg-soft))] p-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
          Vaše preferencie
        </div>
        <p className="text-sm">Zmeňte súhlas s nepovinnými cookies kedykoľvek.</p>
      </div>
      <button className="font-mono text-xs px-4 py-3 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
        [ Spravovať preferencie ]
      </button>
    </div>
  </PageShell>
);

export default CookiesPage;
