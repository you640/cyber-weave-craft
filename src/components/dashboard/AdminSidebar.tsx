import { LayoutGrid, Users, Activity, Terminal, Plug, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// CONTROL · 11
const items = [
  { title: "Overview", url: "/dashboard", icon: LayoutGrid, active: true },
  { title: "Users", url: "#", icon: Users, active: false },
  { title: "Attack Feed", url: "#", icon: Activity, active: false },
  { title: "Shell", url: "#", icon: Terminal, active: false },
  { title: "MCP", url: "#", icon: Plug, active: false },
  { title: "Settings", url: "#", icon: Settings, active: false },
];

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="wire-border-r">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            // CONTROL · 11
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={item.active}
                    disabled={!item.active}
                    className={
                      item.active
                        ? "font-mono text-xs"
                        : "font-mono text-xs opacity-40 cursor-not-allowed"
                    }
                  >
                    {item.active ? (
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          isActive
                            ? "text-primary bg-[hsl(var(--wire-bg-soft))]"
                            : "hover:bg-[hsl(var(--wire-bg-soft))]"
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>[ {item.title.toUpperCase()} ]</span>}
                      </NavLink>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && (
                          <>
                            <span>[ {item.title.toUpperCase()} ]</span>
                            <span className="ml-auto text-[9px] tracking-[0.2em] text-muted-foreground">
                              SOON
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
      </SidebarContent>
    </Sidebar>
  );
};
