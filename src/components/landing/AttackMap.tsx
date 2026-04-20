import { SectionMarker, WireAnnotation } from "@/components/landing/WireAnnotation";
import { CounterStack } from "@/components/landing/AttackMap/CounterStack";
import { WorldMap } from "@/components/landing/AttackMap/WorldMap";
import { LiveLog } from "@/components/landing/AttackMap/LiveLog";
import { AttackStreamProvider, useAttackStreamContext } from "@/components/landing/AttackMap/AttackStreamContext";

const StatusFooter = () => {
  const { connected } = useAttackStreamContext();
  return (
    <div className="mt-5 pt-4 border-t border-dashed border-[hsl(var(--wire-line))] flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
      <span>data zdroj: nexify guard mesh · edge function</span>
      <span>refresh: server-sent events</span>
      <span>obfuscated: posledné 2 oktety IP</span>
      <span className={connected ? "text-primary" : "text-[hsl(var(--wire-handwritten))]"}>
        ● {connected ? "stream live" : "reconnecting…"}
      </span>
    </div>
  );
};

export const AttackMap = () => {
  return (
    <section id="live" className="mt-24 scroll-mt-24">
      <SectionMarker num="09" label="CYBER OPERATIONS CENTER" />

      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Takto vyzerá <span className="italic font-light text-primary">noc na internete</span>
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Kým väčšina ľudí spí, niekde práve beží brute-force, niekde scraping, niekde pokus o SQL injection a niekde sa bot tvári ako zákazník s veľmi čudným vkusom na URL parametre.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Táto mapa nie je dekorácia. Je to pripomienka, že internet je otvorené mesto a brána bez stráže je len pozvánka napísaná pekným fontom.
          </p>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Každá bodka je pokus. Každý riadok v logu je príbeh, ktorý sa našťastie neskončil incident reportom. Stream ide zo servera. Drámu netvoríme — internet ju ochotne dodáva sám.
          </p>
        </div>
        <WireAnnotation rotate={-3} className="text-xl">
          ← live z edge function
        </WireAnnotation>
      </div>

      <AttackStreamProvider>
        <div className="wire-border wire-shadow bg-background p-5 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <CounterStack />
            </div>
            <div className="lg:col-span-5 min-h-[340px]">
              <WorldMap />
            </div>
            <div className="lg:col-span-4 min-h-[340px]">
              <LiveLog />
            </div>
          </div>
          <StatusFooter />
        </div>
      </AttackStreamProvider>
    </section>
  );
};
