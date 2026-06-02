import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, MessageSquare, Sparkles, Wrench } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useTools } from "@/hooks/useTools";
import { useAdminTestimonials } from "@/hooks/useAdminTestimonials";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Profile } from "@/types/app";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: projects } = useProjects(true);
  const { data: tools } = useTools();
  const { data: testimonials } = useAdminTestimonials();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const totalProjects = projects?.length ?? 0;
  const publishedProjects = projects?.filter((project) => project.published).length ?? 0;
  const featuredTools = tools?.filter((tool) => tool.is_featured).length ?? 0;
  const publishedTestimonials = testimonials?.filter((testimonial) => testimonial.published).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace overview"
        title={`Welcome back, ${displayName}`}
        description="Here’s a quick snapshot of your published content and the next places to update."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="admin-surface">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Sparkles className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">{publishedProjects} currently visible on the site</p>
          </CardContent>
        </Card>

        <Card className="admin-surface">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Tools</CardTitle>
            <Wrench className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredTools}</div>
            <p className="text-xs text-muted-foreground">Displayed in the public tools carousel</p>
          </CardContent>
        </Card>

        <Card className="admin-surface">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <MessageSquare className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedTestimonials}</div>
            <p className="text-xs text-muted-foreground">Published pieces of social proof</p>
          </CardContent>
        </Card>

        <Card className="admin-surface">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile readiness</CardTitle>
            <Folder className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.bio ? "Complete" : "Needs bio"}</div>
            <p className="text-xs text-muted-foreground">Keep your admin profile polished for internal handoffs</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="admin-surface">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump straight into the most common content updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="h-auto w-full justify-start rounded-xl px-4 py-4 text-left">
              <Link to="/admin/projects">
                <div>
                  <div className="font-medium">Add or update projects</div>
                  <div className="text-sm text-muted-foreground">Refresh case studies, images, and featured placements.</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto w-full justify-start rounded-xl px-4 py-4 text-left">
              <Link to="/admin/tools">
                <div>
                  <div className="font-medium">Curate your stack</div>
                  <div className="text-sm text-muted-foreground">Keep logos, categories, and featured tools tidy.</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto w-full justify-start rounded-xl px-4 py-4 text-left">
              <Link to="/admin/testimonials">
                <div>
                  <div className="font-medium">Review social proof</div>
                  <div className="text-sm text-muted-foreground">Publish testimonials that support your strongest offers.</div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="admin-surface">
          <CardHeader>
            <CardTitle>Content health checks</CardTitle>
            <CardDescription>High-value follow-ups surfaced from the current content state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Review unpublished work</p>
                <p className="text-xs text-muted-foreground">{totalProjects - publishedProjects} project(s) are still drafts.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 mt-2 rounded-full bg-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium">Check featured tools</p>
                <p className="text-xs text-muted-foreground">{featuredTools > 0 ? "Carousel has content ready for the landing page." : "No featured tools are currently selected."}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Audit testimonial freshness</p>
                <p className="text-xs text-muted-foreground">{publishedTestimonials} testimonial(s) are currently public.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
