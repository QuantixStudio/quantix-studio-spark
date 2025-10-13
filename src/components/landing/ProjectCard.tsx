import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import ProjectDetailModal from "./ProjectDetailModal";

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
  project_category: ProjectCategory | null;
  project_technologies: Array<{ technologies: Technology }>;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const technologies = project.project_technologies
    ?.map(pt => pt.technologies)
    .slice(0, 4) || [];

  return (
    <>
      <Card 
        className="overflow-hidden hover-lift cursor-pointer group border-border/50"
        onClick={() => setIsModalOpen(true)}
      >
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
              <span className="text-sm font-medium">View Details</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </div>

        <CardContent className="pt-6">
          {project.project_category && (
            <Badge variant="secondary" className="mb-3">
              {project.project_category.name}
            </Badge>
          )}

          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
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

      <ProjectDetailModal
        slug={project.slug}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
