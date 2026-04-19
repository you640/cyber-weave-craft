import { PageShell } from "@/components/layout/PageShell";
import { SectionMarker } from "@/components/landing/WireAnnotation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Ďakujeme!",
        description: "Ozveme sa do 24 hodín. Pri incidente volajte priamo na +421 911 000 000.",
      });
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <PageShell
      title="Kontakt · 24/7 incident line | Nexify"
      description="Napíšte nám alebo volajte priamo. Incident response 24/7. Bratislava, SK + CZ pokrytie."
    >
      <SectionMarker num="CONTACT · 04" label="Kontakt" />

      <header className="mb-8 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Napíšte. Alebo zavolajte. Hocikedy.
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Bežné otázky cez formulár — ozveme sa do 24 hodín. Pri prebiehajúcom incidente volajte priamo na 24/7 linku.
        </p>
      </header>

      <div className="wire-border-solid bg-primary text-primary-foreground p-4 mb-10 wire-shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono text-sm">
          <span className="text-base">🚨</span> INCIDENT? Volajte priamo:{" "}
          <a href="tel:+421911000000" className="font-bold underline underline-offset-4">
            +421 911 000 000
          </a>{" "}
          <span className="opacity-80 text-xs">(24/7)</span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-80">
          Reakcia &lt; 4h
        </span>
      </div>

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-10">
        <aside className="space-y-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
              Email
            </div>
            <a href="mailto:hello@nexify-studio.tech" className="text-sm hover:text-primary">
              hello@nexify-studio.tech
            </a>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
              Incident line · 24/7
            </div>
            <a href="tel:+421911000000" className="text-sm hover:text-primary">
              +421 911 000 000
            </a>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
              Adresa
            </div>
            <p className="text-sm leading-relaxed">
              Nexify Studio s. r. o.<br />
              Mlynské nivy 5<br />
              821 09 Bratislava<br />
              Slovensko
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
              Fakturačné údaje
            </div>
            <p className="text-sm leading-relaxed font-mono text-xs">
              IČO: 50 000 000<br />
              DIČ: 2120 000 000<br />
              IČ DPH: SK2120 000 000
            </p>
          </div>

          <div className="wire-border bg-[hsl(var(--wire-bg-soft))] p-4">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
              Pokrytie
            </div>
            <p className="text-xs leading-relaxed">SK · CZ · AT · DE · PL · EN-speaking remote</p>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="wire-border-solid p-6 md:p-8 wire-shadow-sm space-y-5">
          <div>
            <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
              Meno *
            </label>
            <input
              required
              type="text"
              className="w-full wire-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              placeholder="Jana Nováková"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                Email *
              </label>
              <input
                required
                type="email"
                className="w-full wire-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="jana@firma.sk"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                Firma
              </label>
              <input
                type="text"
                className="w-full wire-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="ACME, s. r. o."
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
              Typ požiadavky *
            </label>
            <select
              required
              className="w-full wire-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              defaultValue=""
            >
              <option value="" disabled>
                — vyberte —
              </option>
              <option>Bezplatný basic security check</option>
              <option>Audit / pentest</option>
              <option>24/7 strážna služba (retainer)</option>
              <option>WP hardening</option>
              <option>Incident response (NIE prebiehajúci)</option>
              <option>Iné / konzultácia</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground block mb-2">
              Správa *
            </label>
            <textarea
              required
              rows={5}
              className="w-full wire-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="O akom webe / aplikácii hovoríme? Aký je hlavný problém alebo cieľ?"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full font-mono text-sm px-4 py-3 bg-primary text-primary-foreground wire-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-60"
          >
            {submitting ? "Odosielam…" : "Odoslať správu →"}
          </button>

          <p className="font-mono text-[10px] text-muted-foreground tracking-wide">
            Odoslaním súhlasíte so spracovaním údajov podľa{" "}
            <a href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </PageShell>
  );
};

export default ContactPage;
