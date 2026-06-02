import {
  LayoutGrid, Users, Activity, Terminal, Plug, Settings,
  HeartPulse, ShieldCheck, FileText, Stethoscope, Zap, KeyRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type Item = { title: string; url: string; icon: typeof LayoutGrid; active?: boolean };

const SECTIONS: { label: string; items: Item[] }[] = [
  {
    label: "Monitor",
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutGrid, active: true },
      { title: "Health", url: "/dashboard/health", icon: HeartPulse, active: true },
      { title: "Diagnostics", url: "/dashboard/diagnostics", icon: Stethoscope, active: true },
    ],
  },
  {
    label: "Audit",
    items: [
      { title: "WP Audit", url: "/dashboard/wp-audit", icon: ShieldCheck, active: true },
      { title: "Reports", url: "/dashboard/reports", icon: FileText, active: true },
    ],
  },
  {
    label: "Ops",
    items: [
      { title: "Shell", url: "/dashboard/shell", icon: Terminal, active: true },
      { title: "Shell Live", url: "/dashboard/shell-live", icon: Zap, active: true },
      { title: "MCP", url: "/dashboard/mcp", icon: Plug, active: true },
    ],
  },
  {
    label: "Security",
    items: [
      { title: "MFA", url: "/dashboard/mfa", icon: KeyRound, active: true },
    ],
  },
  {
    label: "Coming soon",
    items: [
      { title: "Users", url: "#", icon: Users, active: false },
      { title: "Attack Feed", url: "#", icon: Activity, active: false },
      { title: "Settings", url: "#", icon: Settings, active: false },
    ],
  },
];

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-[hsl(var(--border-subtle))]">
      <SidebarContent className="bg-surface">
        {SECTIONS.map((section) => (
          <SidebarGroup key={section.label} className="px-2">
            {!collapsed && (
              <SidebarGroupLabel className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70 px-2">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={item.active}
                      disabled={!item.active}
                      tooltip={collapsed ? item.title : undefined}
                      className={cn(
                        "h-9 rounded-md text-sm font-medium transition-colors relative",
                        !item.active && "opacity-40 cursor-not-allowed",
                      )}
                    >
                      {item.active ? (
                        <NavLink
                          to={item.url}
                          end
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-2.5 px-2.5",
                              isActive
                                ? "bg-[hsl(var(--surface-muted))] text-foreground before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-primary before:rounded-r"
                                : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-muted))]",
                            )
                          }
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      ) : (
                        <div className="flex items-center gap-2.5 px-2.5 w-full">
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && (
                            <>
                              <span>{item.title}</span>
                              <span className="ml-auto text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60">
                                soon
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter className="border-t border-[hsl(var(--border-subtle))] bg-surface">
          <div className="px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
              cloud · ready
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/60">v0.1</span>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};
