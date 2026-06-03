import { Menu } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu aria-hidden="true" />
                </Button>
              </SidebarTrigger>
              <div className="min-w-0 text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
                  Admin workspace
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  Manage portfolio content, tools, and testimonials.
                </p>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="page-shell">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
