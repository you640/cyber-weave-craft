import { AnnouncementTicker } from "./AnnouncementTicker";
import { TechMarquee } from "./TechMarquee";
import { HeroHeadline } from "./hero/HeroHeadline";
import { HeroCTA } from "./hero/HeroCTA";
import { HeroStats } from "./hero/HeroStats";
import { HeroPreview } from "./hero/HeroPreview";

export const Hero = () => {
  return (
    <header className="mt-10 md:mt-14">
      <div className="mb-8">
        <AnnouncementTicker />
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <HeroHeadline />
          <HeroCTA />
          <HeroStats />
        </div>
        <HeroPreview />
      </div>

      <TechMarquee />
    </header>
  );
};
