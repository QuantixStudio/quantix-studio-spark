import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ExternalLink, Github, ArrowLeft, Mail } from "lucide-react";
import { useProjectDetail } from "@/hooks/useProjectDetail";
export default function ProjectDetail() {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const {
    data: project,
    isLoading
  } = useProjectDetail(slug || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  if (isLoading) {
    return <div className="min-h-screen bg-background">
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
      </div>;
  }
  if (!project) {
    return <div className="min-h-screen bg-background flex flex-col">
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
      </div>;
  }
  const projectData = project as any;
  const images = projectData.images && Array.isArray(projectData.images) && projectData.images.length > 0 ? projectData.images.sort((a: any, b: any) => a.order - b.order) : project.cover_url ? [{
    url: project.cover_url,
    alt: project.title,
    is_main: true,
    order: 0
  }] : [];
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  return <div className="min-h-screen bg-background">
      <Navbar />

      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <Link to="/portfolio" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors my-[20px]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolio
        </Link>

        {images.length > 0 && <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image: any, index: number) => <CarouselItem key={index}>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group" onClick={() => openLightbox(index)}>
                      <img src={image.url} alt={image.alt || project.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" style={{
                  imageRendering: "auto"
                }} loading="lazy" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
              {images.length > 1 && <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>}
            </Carousel>
          </div>}

        <div className="mb-6">
          {project.project_category && <Badge variant="secondary" className="text-sm mb-3">
              {project.project_category.name}
            </Badge>}
          <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
        </div>

        {projectData.key_metric && <div className="mb-6 p-4 border border-accent rounded-lg bg-accent/5">
            <p className="text-accent font-semibold">{projectData.key_metric}</p>
          </div>}

        {project.project_tools && project.project_tools.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.project_tools.map(tool => (
                <div 
                  key={tool.id}
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                >
                  {tool.logo_path && (
                    <img 
                      src={`https://tbdhzxarsshzoweyndha.supabase.co/storage/v1/object/public/tools_logos/${tool.logo_path}`}
                      alt={tool.name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className="text-sm font-medium">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {project.full_description || project.short_description}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {project.demo_url && <Button asChild>
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live Demo
              </a>
            </Button>}
          {project.github_url && <Button variant="outline" asChild>
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>}
        </div>
      </article>

      <div className="fixed bottom-8 right-8 z-50">
        <Button size="lg" className="shadow-lg" asChild>
          <a href="/#contact">
            <Mail className="mr-2 h-5 w-5" />
            Request Similar Project
          </a>
        </Button>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-black/95">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {images[lightboxIndex] && <img src={images[lightboxIndex].url} alt={images[lightboxIndex].alt || project.title} className="max-w-full max-h-full object-contain" style={{
            imageRendering: "auto"
          }} />}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>;
}