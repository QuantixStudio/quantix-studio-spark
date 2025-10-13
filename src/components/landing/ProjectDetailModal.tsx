import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Github } from "lucide-react";
import { useProjectDetail } from "@/hooks/useProjectDetail";

interface ProjectDetailModalProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({ slug, isOpen, onClose }: ProjectDetailModalProps) {
  const { data: project, isLoading } = useProjectDetail(slug);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : project ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                {project.project_category && (
                  <Badge variant="secondary">{project.project_category.name}</Badge>
                )}
              </div>
              <DialogTitle className="text-3xl">{project.title}</DialogTitle>
            </DialogHeader>

            {project.cover_url && (
              <img
                src={project.cover_url}
                alt={project.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            )}

            {project.project_technologies && project.project_technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.project_technologies.map((pt) => (
                  <Badge key={pt.technologies.id} variant="outline">
                    {pt.technologies.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed text-base">
                {project.full_description || project.short_description}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              {project.demo_url && (
                <Button asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Project not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
