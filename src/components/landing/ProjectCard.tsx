import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Tool {
  id: string;
  name: string;
  slug: string;
  logo_path: string | null;
  categories: string[];
}

interface ProjectCategory {
  id: string;
  name: string;
  description: string | null;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  cover_url: string | null;
  images: any[] | null;
  key_metric: string | null;
  show_on_home: boolean;
  project_category: ProjectCategory | null;
  project_tools: Tool[];
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const images = project.images && Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : project.cover_url
    ? [{ url: project.cover_url, alt: project.title, is_main: true, order: 0 }]
    : [];
  const mainImage = images.find((img: any) => img.is_main)?.url || images[0]?.url;

  const tools = project.project_tools?.slice(0, 4) || [];

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className="block"
    >
      <Card className="overflow-hidden group border transition-colors hover:border-accent">
        <div className="relative overflow-hidden aspect-video bg-muted">
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
            {project.short_description}
          </p>

          {tools.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => (
                <div 
                  key={tool.id} 
                  className="flex items-center gap-1.5 px-2 py-1 border rounded-md bg-card hover:bg-accent/5 transition-colors"
                  title={tool.name}
                >
                  {tool.logo_path && (
                    <img 
                      src={`https://tbdhzxarsshzoweyndha.supabase.co/storage/v1/object/public/tools_logos/${tool.logo_path}`}
                      alt={tool.name}
                      className="w-4 h-4 object-contain"
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
