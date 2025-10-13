import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { useProjectDetail } from "@/hooks/useProjectDetail";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProjectDetail(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          <Skeleton className="w-full h-96 rounded-lg mb-8" />
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="flex gap-2 mb-8">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-48 w-full" />
        </article>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        {project.cover_url && (
          <img
            src={project.cover_url}
            alt={project.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div className="mb-6">
          {project.project_category && (
            <Badge variant="secondary" className="text-sm mb-3">
              {project.project_category.name}
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
        </div>

        {project.project_technologies && project.project_technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.project_technologies.map((pt) => (
              <Badge key={pt.technologies.id} variant="outline">
                {pt.technologies.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {project.full_description || project.short_description}
          </p>
        </div>

        <div className="flex gap-4">
          {project.demo_url && (
            <Button asChild>
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live Demo
              </a>
            </Button>
          )}
          {project.github_url && (
            <Button variant="outline" asChild>
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
