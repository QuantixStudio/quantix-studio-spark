import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getMainProjectImageUrl } from "@/lib/projectUtils";
import { getToolLogoUrl } from "@/lib/toolStorageUtils";
import { trackProjectOpen } from "@/lib/analytics";
import type { ProjectWithTools } from "@/types/app";

interface ProjectCardProps {
  project: ProjectWithTools;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const mainImage = getMainProjectImageUrl(project);
  const tools = project.project_tools?.slice(0, 4) || [];

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      onClick={() => trackProjectOpen(project.slug, "legacy_project_card")}
      className="media-hover-trigger block"
    >
      <Card className="overflow-hidden group border transition-colors hover:border-accent">
        <div className="relative overflow-hidden aspect-video bg-muted">
          {mainImage ? (
            <img
              src={mainImage}
              alt={project.title}
              className="media-hover-target w-full h-full object-cover"
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
            {project.short_description}
          </p>

          {tools.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <div 
                  key={tool.id} 
                  className="media-hover-trigger flex items-center gap-1.5 px-2 py-1 border rounded-md bg-card hover:bg-accent/5 transition-colors"
                  title={tool.name}
                >
                  {tool.logo_path && (
                    <img 
                      src={getToolLogoUrl(tool.logo_path) || ""}
                      alt={tool.name}
                      className="media-hover-target w-4 h-4 object-contain"
                    />
                  )}
                  <span className="text-xs font-medium">{tool.name}</span>
                </div>
              ))}
            </div>
          )}
      </CardContent>
    </Card>
    </Link>
  );
}
