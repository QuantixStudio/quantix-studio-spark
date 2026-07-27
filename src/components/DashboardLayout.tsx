import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";

interface CurrentProfileSummary {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: "admin" | "manager" | "client" | null;
  created_at: string | null;
  updated_at: string | null;
}

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const { data: currentProfile } = useQuery({
    queryKey: ["current-profile", user?.id],
    queryFn: async () => {
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, bio, role, created_at, updated_at")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as unknown as CurrentProfileSummary | null;
    },
    enabled: Boolean(user),
  });

  const fullName = currentProfile?.full_name?.trim() || user?.user_metadata?.full_name || "Current user";
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || "Current";
  const lastName = nameParts.slice(1).join(" ") || "User";
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "CU";
  const role = currentProfile?.role || "client";
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="flex min-h-[88px] items-center justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu aria-hidden="true" />
                </Button>
              </SidebarTrigger>
              <div className="flex min-w-0 items-center gap-3.5">
                <Avatar className="h-14 w-14 border border-white/10 bg-white/[0.03]">
                  {currentProfile?.avatar_url ? (
                    <AvatarImage
                      src={currentProfile.avatar_url}
                      alt={`${firstName} ${lastName}`}
                      className="object-cover object-center"
                    />
                  ) : null}
                  <AvatarFallback className="bg-accent/90 text-background">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 space-y-0.5">
                  <p className="truncate text-[15px] font-semibold leading-tight text-foreground sm:text-lg">
                    {fullName}
                  </p>
                  <p className="truncate text-sm font-medium leading-tight text-muted-foreground">
                    {roleLabel}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-3 py-6 sm:px-4 lg:px-5">
            <div className="page-shell">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
