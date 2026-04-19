import { WireNav } from "@/components/landing/WireNav";
import { Hero } from "@/components/landing/Hero";
import { Tiers } from "@/components/landing/Tiers";
import { Services } from "@/components/landing/Services";
import { AddonsTable } from "@/components/landing/AddonsTable";
import { Retainers } from "@/components/landing/Retainers";
import { FAQ } from "@/components/landing/FAQ";
import { WireFooter } from "@/components/landing/WireFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative wire-dots">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-16">
        <WireNav />
        <main>
          <Hero />
          <Tiers />
          <Services />
          <AddonsTable />
          <Retainers />
          <FAQ />
        </main>
        <WireFooter />
      </div>
    </div>
  );
};

export default Index;
