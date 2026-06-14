import { Home, User, Settings, LogOut, Folder, Wrench, MessageSquare } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="border-sidebar-border/60 bg-transparent"
    >
      <SidebarHeader className="px-4 pb-3 pt-5">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-white/6 bg-gradient-to-b from-white/[0.045] to-transparent px-3 py-3.5 transition-all duration-200",
            isCollapsed ? "justify-center px-2.5" : "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
          )}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white via-neutral-100 to-neutral-300 text-[1.3rem] font-semibold tracking-[-0.04em] text-black shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
            Q
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="text-[1.05rem] font-semibold tracking-[-0.04em] text-sidebar-foreground">
                QUANTIX
              </h2>
              <p className="mt-0.5 text-[0.71rem] uppercase tracking-[0.18em] text-sidebar-foreground/45">
                Studio Admin
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-4 bg-white/8" />

      <SidebarContent className="bg-transparent px-2 pb-3">
        <SidebarGroup className="px-2 py-4">
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 pb-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-sidebar-foreground/35">
              Workspace
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) => cn(
                        "group relative flex min-h-11 items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-2.5 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/70",
                        isCollapsed && "justify-center px-2.5",
                        isActive
                          ? "border-white/10 bg-white/[0.065] text-sidebar-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.18)]"
                          : "border-transparent text-sidebar-foreground/58 hover:border-white/6 hover:bg-white/[0.03] hover:text-sidebar-foreground",
                      )}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute inset-y-2 left-0 w-px rounded-full bg-white/60" />
                          )}
                          <div
                            className={cn(
                              "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-200",
                              isActive
                                ? "border-white/10 bg-white/[0.07] text-white"
                                : "border-transparent bg-transparent text-sidebar-foreground/60 group-hover:border-white/8 group-hover:bg-white/[0.04] group-hover:text-sidebar-foreground/90",
                            )}
                          >
                            <item.icon className="h-[1.05rem] w-[1.05rem]" />
                          </div>
                          {!isCollapsed && (
                            <span
                              className={cn(
                                "relative z-10 text-[0.95rem] tracking-[-0.01em] transition-colors duration-200",
                                isActive ? "font-medium text-sidebar-foreground" : "font-normal",
                              )}
                            >
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

      <SidebarSeparator className="mx-4 bg-white/8" />

      <SidebarFooter className="bg-transparent px-4 pb-5 pt-3">
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            "h-11 w-full rounded-2xl border border-transparent text-sidebar-foreground/52 transition-all duration-200",
            "hover:border-white/6 hover:bg-white/[0.03] hover:text-destructive",
            isCollapsed ? "justify-center px-0" : "justify-start gap-3 px-3.5",
          )}
        >
          <LogOut className="h-[1.05rem] w-[1.05rem]" />
          {!isCollapsed && <span className="text-[0.95rem]">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
