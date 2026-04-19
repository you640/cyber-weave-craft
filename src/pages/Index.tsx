import { WireNav } from "@/components/landing/WireNav";
import { Hero } from "@/components/landing/Hero";
import { Guard } from "@/components/landing/Guard";
import { ThreatBanner } from "@/components/landing/ThreatBanner";
import { Tiers } from "@/components/landing/Tiers";
import { Services } from "@/components/landing/Services";
import { WatchedThreats } from "@/components/landing/WatchedThreats";
import { AddonsTable } from "@/components/landing/AddonsTable";
import { Retainers } from "@/components/landing/Retainers";
import { Stories } from "@/components/landing/Stories";
import { FAQ } from "@/components/landing/FAQ";
import { GuardStatusBar } from "@/components/landing/GuardStatusBar";
import { WireFooter } from "@/components/landing/WireFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative wire-dots">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-16">
        <WireNav />
        <main>
          <Hero />
          <Guard />
          <ThreatBanner />
          <Tiers />
          <Services />
          <WatchedThreats />
          <AddonsTable />
          <Retainers />
          <Stories />
          <FAQ />
        </main>
        <GuardStatusBar />
        <WireFooter />
      </div>
    </div>
  );
};

export default Index;
