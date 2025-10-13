import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_url: string | null;
  category: string | null;
  technologies: any;
  demo_url: string | null;
  github_url: string | null;
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      } else {
        setProject(data);
      }
      setLoading(false);
    };

    fetchProject();
  }, [slug]);

  if (loading) {
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
          {project.category && (
            <span className="text-primary font-medium">{project.category}</span>
          )}
          <h1 className="text-4xl font-bold mt-2 mb-4">{project.title}</h1>
          <p className="text-xl text-muted-foreground">
            {project.short_description}
          </p>
        </div>

        {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies.map((tech: string, idx: number) => (
              <Badge key={idx} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {project.full_description && (
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-lg leading-relaxed">{project.full_description}</p>
          </div>
        )}

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
