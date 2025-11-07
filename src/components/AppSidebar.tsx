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
    <Sidebar collapsible="icon" className="border-r bg-card">
      <SidebarContent>
        <div className="px-6 py-8">
          <div className={`flex items-center gap-3 transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
              Q
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg tracking-tight">QUANTIX</h2>
                <p className="text-xs text-muted-foreground">Studio Admin</p>
              </div>
            )}
          </div>
        </div>

        <Separator className="mx-4" />

        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className={`px-3 mb-2 text-xs font-semibold uppercase tracking-wider ${isCollapsed ? "sr-only" : ""}`}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-primary-foreground" : ""}`} />
                          {!isCollapsed && (
                            <span className="font-medium text-sm">{item.title}</span>
                          )}
                          {isActive && !isCollapsed && (
                            <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground/80 animate-pulse" />
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

      <SidebarFooter className="p-4 border-t bg-muted/30">
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
