import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ExternalLink, Github, ArrowLeft, Mail, FolderSearch } from "lucide-react";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { getProjectImages } from "@/lib/projectUtils";
import { getToolLogoUrl } from "@/lib/toolStorageUtils";
import { StatePanel } from "@/components/shared/StatePanel";

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
        <article className="container mx-auto max-w-5xl px-5 py-20 sm:px-6 md:px-8">
          <Skeleton className="mb-6 h-5 w-32" />
          <Skeleton className="mb-8 aspect-video w-full rounded-2xl" />
          <Skeleton className="mb-4 h-8 w-32" />
          <Skeleton className="mb-6 h-12 w-3/4" />
          <div className="flex gap-2 mb-8">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-48 w-full rounded-2xl" />
        </article>
        <Footer />
      </div>;
  }
  if (!project) {
    return <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 px-5 py-24 sm:px-6 md:px-8">
          <div className="mx-auto max-w-3xl">
            <StatePanel
              icon={FolderSearch}
              title="Project not found"
              description="The project you're looking for doesn't exist, has been unpublished, or the link is no longer valid."
              action={
                <Button asChild>
                  <Link to="/portfolio">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Portfolio
                  </Link>
                </Button>
              }
            />
          </div>
        </div>
        <Footer />
      </div>;
  }
  const images = getProjectImages(project.images, {
    coverUrl: project.cover_url,
    title: project.title,
  });
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  return <div className="min-h-screen bg-background">
      <Navbar />

      <article className="container mx-auto max-w-5xl px-5 py-20 sm:px-6 md:px-8">
        <Link to="/portfolio" className="my-5 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolio
        </Link>

        {images.length > 0 && <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => <CarouselItem key={index}>
                    <div className="media-hover-trigger group relative aspect-video cursor-pointer overflow-hidden rounded-2xl bg-muted" onClick={() => openLightbox(index)}>
                      <img src={image.url} alt={image.alt || project.title} className="media-hover-target w-full h-full object-cover" style={{
                  imageRendering: "auto"
                }} loading="lazy" />
                      <div className="media-hover-overlay absolute inset-0 bg-black/10 flex items-center justify-center">
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

        <div className="mb-6 space-y-3">
          {project.project_category && <Badge variant="secondary" className="text-sm mb-3">
              {project.project_category.name}
            </Badge>}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">{project.title}</h1>
        </div>

        {project.key_metric && <div className="mb-6 rounded-2xl border border-accent/60 bg-accent/5 p-4">
            <p className="text-accent font-semibold">{project.key_metric}</p>
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
                  className="media-hover-trigger flex items-center gap-2 rounded-xl border bg-card px-3 py-2 transition-colors hover:bg-accent/5"
                >
                  {tool.logo_path && (
                    <img 
                      src={getToolLogoUrl(tool.logo_path) || ""}
                      alt={tool.name}
                      className="media-hover-target w-6 h-6 object-contain bg-white rounded-[5px] p-1"
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

      <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:bottom-8 sm:right-8">
        <Button size="lg" className="w-full shadow-lg sm:w-auto" asChild>
          <Link to="/#contact">
            <Mail className="mr-2 h-5 w-5" />
            Request Similar Project
          </Link>
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
