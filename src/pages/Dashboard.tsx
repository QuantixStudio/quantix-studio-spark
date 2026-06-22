import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, MessageSquare, Sparkles, Wrench } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { usePortfolioTechnologies } from "@/hooks/usePortfolioSystem";
import { useAdminTestimonials } from "@/hooks/useAdminTestimonials";
import { AdminMetricCard } from "@/components/shared/AdminMetricCard";
import type { Profile } from "@/types/app";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: projects } = useProjects(true);
  const { data: technologies } = usePortfolioTechnologies();
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
      <div className="page-stack">
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
  const totalTechnologies = technologies?.length ?? 0;
  const technologiesWithLogos = technologies?.filter((technology) => Boolean(technology.logo_path)).length ?? 0;
  const publishedTestimonials = testimonials?.filter((testimonial) => testimonial.published).length ?? 0;

  return (
    <div className="page-stack">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          title="Projects"
          value={totalProjects}
          description={`${publishedProjects} currently visible on the site`}
          icon={Sparkles}
        />
        <AdminMetricCard
          title="Technologies"
          value={totalTechnologies}
          description={`${technologiesWithLogos} with storage-backed logos`}
          icon={Wrench}
        />
        <AdminMetricCard
          title="Testimonials"
          value={publishedTestimonials}
          description="Published pieces of social proof"
          icon={MessageSquare}
        />
        <AdminMetricCard
          title="Profile readiness"
          value={profile?.bio ? "Complete" : "Needs bio"}
          description="Keep your admin profile polished for internal handoffs"
          icon={Folder}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="admin-surface">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump straight into the most common content updates</CardDescription>
          </CardHeader>
          <CardContent className="content-stack">
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
                  <div className="text-sm text-muted-foreground">Keep technologies, categories, testimonials, and stack logos tidy.</div>
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
          <CardContent className="content-stack">
            <div className="flex items-start gap-3">
              <div className="status-dot bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Review unpublished work</p>
                <p className="text-xs text-muted-foreground">{totalProjects - publishedProjects} project(s) are still drafts.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="status-dot bg-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium">Check stack logos</p>
                <p className="text-xs text-muted-foreground">{technologiesWithLogos > 0 ? "The homepage carousel has storage-backed technology logos ready." : "No technology logos are currently available for the carousel."}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="status-dot bg-primary" />
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
