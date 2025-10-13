import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  cover_url: string | null;
  category: string | null;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/project/${project.slug}`} target="_blank" rel="noopener noreferrer">
      <Card className="overflow-hidden hover-lift cursor-pointer group border-border/50">
        <div className="relative overflow-hidden aspect-video bg-muted">
          {project.cover_url ? (
            <img
              src={project.cover_url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <div className="text-white flex items-center gap-2">
              <span className="text-sm font-medium">View Project</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </div>
        <CardContent className="pt-6">
          {project.category && (
            <Badge variant="outline" className="mb-3">
              {project.category}
            </Badge>
          )}
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {project.short_description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
