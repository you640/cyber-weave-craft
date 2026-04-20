import { useEffect } from "react";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { Overview } from "@/components/dashboard/panels/Overview";
import { McpPanel } from "@/components/dashboard/panels/McpPanel";
import { ShellPanel } from "@/components/dashboard/panels/ShellPanel";
import { ShellLivePanel } from "@/components/dashboard/panels/ShellLivePanel";
import { HealthPanel } from "@/components/dashboard/panels/HealthPanel";
import { WpAuditPanel } from "@/components/dashboard/panels/WpAuditPanel";
import { ReportsPanel } from "@/components/dashboard/panels/ReportsPanel";
import { DiagnosticsPanel } from "@/components/dashboard/panels/DiagnosticsPanel";
import { UserMenu } from "@/components/auth/UserMenu";
import nexifyLogo from "@/assets/nexify-logo.png";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Admin · Control · Nexify";
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background wire-dots">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 px-4 md:px-6 border-b border-dashed border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="font-mono" />
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={nexifyLogo}
                alt="Nexify Guard logo"
                className="h-20 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                ← exit
              </span>
            </Link>
            <div className="ml-auto">
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 px-4 md:px-8 py-8 max-w-6xl w-full">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="health" element={<HealthPanel />} />
              <Route path="wp-audit" element={<WpAuditPanel />} />
              <Route path="reports" element={<ReportsPanel />} />
              <Route path="diagnostics" element={<DiagnosticsPanel />} />
              <Route path="mcp" element={<McpPanel />} />
              <Route path="shell" element={<ShellPanel />} />
              <Route path="shell-live" element={<ShellLivePanel />} />
              <Route path="*" element={<Navigate to="." replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
