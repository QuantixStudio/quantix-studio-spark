import { Home, User, Settings, LogOut, Folder } from "lucide-react";
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

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Projects", url: "/admin/projects", icon: Folder },
  { title: "Profile", url: "/admin/profile", icon: User },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="bg-background">
        <div className="p-6">
          <h2 className={`font-bold text-xl ${isCollapsed ? "hidden" : ""}`}>
            QUANTIX STUDIO
          </h2>
          {isCollapsed && (
            <div className="h-8 w-8 rounded-lg border border-accent flex items-center justify-center text-accent font-bold">
              Q
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "border-l-4 border-accent bg-accent/10 hover:bg-accent/10"
                          : "border-l-4 border-transparent hover:bg-accent/5"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start hover:bg-accent/10"
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
