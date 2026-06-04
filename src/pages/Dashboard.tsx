import { useEffect } from "react";
import { Link, Route, Routes, Navigate, useLocation } from "react-router-dom";
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
import { MfaPanel } from "@/components/dashboard/panels/MfaPanel";
import { UserMenu } from "@/components/auth/UserMenu";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import nexifyLogo from "@/assets/nexify-logo.png";
import { Search, ChevronRight } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  "": "Overview",
  health: "Health",
  "wp-audit": "WP Audit",
  reports: "Reports",
  diagnostics: "Diagnostics",
  mcp: "MCP",
  shell: "Shell",
  "shell-live": "Shell Live",
  mfa: "MFA",
};

const Breadcrumb = () => {
  const { pathname } = useLocation();
  const sub = pathname.replace(/^\/dashboard\/?/, "");
  const label = ROUTE_LABELS[sub] ?? "Overview";
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
      <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors truncate">
        Dashboard
      </Link>
      {sub && (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          <span className="font-medium text-foreground truncate">{label}</span>
        </>
      )}
    </nav>
  );
};

const Dashboard = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = "Admin · Control · Nexify";
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[hsl(var(--surface-muted))]">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 px-3 md:px-6 border-b border-[hsl(var(--border-subtle))] bg-surface/90 backdrop-blur-md sticky top-0 z-20">
            <SidebarTrigger className="font-mono" />
            <Link
              to="/"
              className="flex items-center gap-2 group shrink-0"
              aria-label="Späť na web"
            >
              <img
                src={nexifyLogo}
                alt="Nexify Guard"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <div className="h-5 w-px bg-[hsl(var(--border-subtle))] mx-1 hidden md:block" />
            <Breadcrumb />
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 h-8 px-3 rounded-md border border-[hsl(var(--border-subtle))] bg-[hsl(var(--surface-muted))] text-xs text-muted-foreground min-w-[220px]">
                <Search className="h-3.5 w-3.5" />
                <span className="flex-1 truncate">Hľadať…</span>
                <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border border-[hsl(var(--border-subtle))]">
                  ⌘K
                </kbd>
              </div>
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl w-full mx-auto">
            <div key={pathname} className="animate-panel-in">
              <Routes>
                <Route index element={<Overview />} />
                <Route path="health" element={<HealthPanel />} />
                <Route path="wp-audit" element={<WpAuditPanel />} />
                <Route path="reports" element={<ReportsPanel />} />
                <Route path="diagnostics" element={<DiagnosticsPanel />} />
                <Route path="mcp" element={<McpPanel />} />
                <Route path="shell" element={<ShellPanel />} />
                <Route path="shell-live" element={<ShellLivePanel />} />
                <Route path="mfa" element={<MfaPanel />} />
                <Route path="*" element={<Navigate to="." replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
