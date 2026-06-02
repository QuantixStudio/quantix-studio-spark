import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { getMainProjectImageUrl } from "@/lib/projectUtils";
import { StatePanel } from "@/components/shared/StatePanel";

export default function ProjectGrid() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <section className="container mx-auto px-5 py-12 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="admin-surface overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <div className="space-y-4 p-6">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-8 w-4/5" />
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-5 py-12 sm:px-6 md:px-8">
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => {
            const mainImage = getMainProjectImageUrl(project);
            const tools = project.project_tools?.slice(0, 4) || [];

            return (
              <Link
                key={project.id}
                to={`/portfolio/${project.slug}`}
                className="block group"
              >
                <Card className="admin-surface h-full overflow-hidden transition-colors hover:border-accent">
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: "auto" }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  <CardContent className="pt-6">
                    {project.project_category && (
                      <Badge variant="secondary" className="mb-3">
                        {project.project_category.name}
                      </Badge>
                    )}

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                      {project.short_description.slice(0, 90)}
                      {project.short_description.length > 90 && "..."}
                    </p>

                    {tools.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tools.map((tool) => (
                          <Badge key={tool.id} variant="outline" className="text-xs">
                            {tool.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <StatePanel
          icon={FolderOpen}
          title="No projects published yet"
          description="This portfolio is ready for new case studies. Publish a project in the admin area and it will appear here automatically."
        />
      )}
    </section>
  );
}
