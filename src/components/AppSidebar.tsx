import { Home, User, Settings, LogOut, Folder, Wrench, MessageSquare } from "lucide-react";
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
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Projects", url: "/admin/projects", icon: Folder },
  { title: "Tools", url: "/admin/tools", icon: Wrench },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare },
  { title: "Profile", url: "/admin/profile", icon: User },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar">
      <SidebarContent className="bg-sidebar">
        <div className="px-6 py-8">
          <div className={`flex items-center gap-3 transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-white to-neutral-300 text-primary-foreground shadow-lg">
              Q
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg tracking-tight text-sidebar-foreground">QUANTIX</h2>
                <p className="text-xs text-sidebar-foreground/60">Studio Admin</p>
              </div>
            )}
          </div>
        </div>

        <Separator className="mx-4 bg-sidebar-border" />

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 overflow-hidden ${
                          isActive
                            ? "text-white shadow-lg"
                            : "text-sidebar-foreground/65 hover:text-sidebar-foreground/95"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 via-white/15 to-white/25" />
                          )}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <item.icon className={`relative z-10 h-5 w-5 transition-all duration-300 ${isActive ? "scale-105" : "group-hover:scale-110"}`} />
                          {!isCollapsed && (
                            <span className={`relative z-10 text-sm transition-all duration-300 ${isActive ? "font-medium" : "font-normal"}`}>
                              {item.title}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar">
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          {!isCollapsed && <span className="text-sm">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
