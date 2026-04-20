import { Bell } from "lucide-react";
import { BrowserFrame } from "../BrowserFrame";
import { WireAnnotation } from "../WireAnnotation";
import dashboardImg from "@/assets/dashboard.png";
import logsImg from "@/assets/logs.png";
import alertsImg from "@/assets/alerts.png";
import reportImg from "@/assets/report.png";

const thumbs = [
  { src: logsImg, alt: "Log forensics", label: "logs" },
  { src: alertsImg, alt: "Incident kanban", label: "alerts" },
  { src: reportImg, alt: "PDF audit report", label: "report" },
];

export const HeroPreview = () => {
  return (
    <div className="lg:col-span-5 lg:sticky lg:top-28">
      <div className="relative">
        <div className="absolute -top-3 -left-3 z-10 wire-border-solid bg-background px-2 py-0.5 font-mono text-[10px] tracking-wider">
          FIG_01 · dashboard.png
        </div>

        <BrowserFrame>
          <div className="aspect-[5/4]">
            <img
              src={dashboardImg}
              alt="Wireframe náhľad bezpečnostného dashboardu Nexify Guard"
              width={1280}
              height={1024}
              className="w-full h-full object-cover"
            />
          </div>
        </BrowserFrame>

        <div className="absolute -bottom-4 -left-4 z-10 wire-border-solid bg-background p-3 wire-shadow-sm max-w-[230px] animate-fade-in">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 shrink-0 rounded-sm bg-destructive/15 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-destructive" />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[10px] font-bold tracking-wider uppercase">
                Brute-force blokovaný
              </div>
              <div className="font-mono text-[9px] text-muted-foreground mt-0.5">
                IP 185.220.x.x · pred 12s
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -right-2 top-1/3 hidden lg:flex items-center">
          <WireAnnotation rotate={8} className="text-xl">
            live SIEM ↑
          </WireAnnotation>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {thumbs.map((img) => (
          <div
            key={img.alt}
            className="group relative wire-border bg-background overflow-hidden aspect-square"
          >
            <img
              src={img.src}
              alt={img.alt}
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-x-0 bottom-0 px-2 py-1 bg-background/90 border-t border-dashed border-foreground/30 font-mono text-[9px] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              ▍ {img.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
