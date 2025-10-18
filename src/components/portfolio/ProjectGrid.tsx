import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import FilterBar from "./FilterBar";

export default function ProjectGrid() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { data: projects, isLoading } = useProjects();

  // Show all projects without filtering (FilterBar disabled)
  const filteredProjects = projects;

  if (isLoading) {
    return (
      <section className="section-container">
        {/* FILTER BAR DISABLED - Showing all projects by default */}
        {/* <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} /> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section-container pt-0">
      {/* FILTER BAR DISABLED - Showing all projects by default */}
      {/* <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} /> */}

      {filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const images = project.images && Array.isArray(project.images) && project.images.length > 0
              ? project.images
              : project.cover_url
              ? [{ url: project.cover_url, alt: project.title, is_main: true, order: 0 }]
              : [];
            const mainImage = images.find((img: any) => img.is_main)?.url || images[0]?.url;
            const technologies = project.project_technologies?.slice(0, 4) || [];

            return (
              <a
                key={project.id}
                href={`/portfolio/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="overflow-hidden border transition-colors hover:border-accent h-full">
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

                    {technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {technologies.map((pt: any) => (
                          <Badge key={pt.technologies.id} variant="outline" className="text-xs">
                            {pt.technologies.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found for this filter.</p>
        </div>
      )}
    </section>
  );
}
