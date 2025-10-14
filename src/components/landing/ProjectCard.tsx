import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface Technology {
  id: string;
  name: string;
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
  project_technologies: Array<{ technologies: Technology }>;
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

  const technologies = project.project_technologies
    ?.map(pt => pt.technologies)
    .slice(0, 4) || [];

  return (
    <a
      href={`/portfolio/${project.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="overflow-hidden group border transition-colors hover:border-accent">
        <div className="relative overflow-hidden aspect-video bg-muted">
          {mainImage ? (
            <img
              src={mainImage}
              alt={project.title}
              className="w-full h-full object-cover"
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

          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <Badge key={tech.id} variant="outline" className="text-xs">
                  {tech.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  );
}
