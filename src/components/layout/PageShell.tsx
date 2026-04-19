import { WireNav } from "@/components/landing/WireNav";
import { WireFooter } from "@/components/landing/WireFooter";
import { GuardStatusBar } from "@/components/landing/GuardStatusBar";
import { useEffect } from "react";

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const PageShell = ({ children, title, description }: PageShellProps) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
    window.scrollTo(0, 0);
  }, [title, description]);

  return (
    <div className="min-h-screen bg-background relative wire-dots">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-16">
        <WireNav />
        <main className="mt-12">{children}</main>
        <GuardStatusBar />
        <WireFooter />
      </div>
    </div>
  );
};
