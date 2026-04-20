import { useEffect, useState } from "react";

const rotatingWords = ["bez stráže.", "bez logov.", "bez záchrannej siete."];

export const HeroHeadline = () => {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % rotatingWords.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight">
        Váš web nemá
        <br />
        zostať v noci
        <br />
        <span className="relative inline-block min-h-[1.1em]">
          <span
            key={wordIdx}
            className="font-display italic font-light text-primary inline-block animate-fade-in"
          >
            {rotatingWords[wordIdx]}
          </span>
          <svg
            className="absolute -bottom-2 left-0 w-full"
            height="8"
            viewBox="0 0 300 8"
            preserveAspectRatio="none"
          >
            <path
              d="M2 5 Q 75 1, 150 4 T 298 3"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>

      <div className="relative mt-8 max-w-xl">
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Keď slušní ľudia zavrú notebook, internet ešte len začína byť kreatívny.{" "}
          <span className="text-foreground font-medium">
            Boti nespia. Scraperom je jedno, že je sviatok.
          </span>
        </p>
        <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
          Nexify Guard sleduje váš web, eshop alebo aplikáciu nepretržite. Keď niečo padne o tretej ráno, nezobudí vás zákazník — riešime to my.
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground tracking-wider">
          // pre firmy, kde výpadok = strata peňazí, reputácie alebo oboch
        </p>
      </div>
    </>
  );
};
