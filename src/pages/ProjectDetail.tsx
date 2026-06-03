import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { StatePanel } from "@/components/shared/StatePanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { getProjectImages } from "@/lib/projectUtils";
import { getToolLogoUrl } from "@/lib/toolStorageUtils";
import {
  ArrowLeft,
  ExternalLink,
  FolderSearch,
  Github,
  Images,
  Layers3,
  LayoutPanelTop,
  Mail,
} from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProjectDetail(slug || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const syncActiveSlide = () => {
      setActiveSlide(carouselApi.selectedScrollSnap());
    };

    syncActiveSlide();
    carouselApi.on("select", syncActiveSlide);
    carouselApi.on("reInit", syncActiveSlide);

    return () => {
      carouselApi.off("select", syncActiveSlide);
      carouselApi.off("reInit", syncActiveSlide);
    };
  }, [carouselApi]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <article className="container mx-auto max-w-6xl px-5 py-20 sm:px-6 md:px-8">
          <Skeleton className="mb-6 h-5 w-32" />
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <Skeleton className="h-14 w-4/5" />
              <Skeleton className="h-24 w-full max-w-3xl" />
              <Skeleton className="h-20 w-full max-w-2xl rounded-[24px]" />
              <div className="flex gap-3">
                <Skeleton className="h-12 w-44 rounded-2xl" />
                <Skeleton className="h-12 w-40 rounded-2xl" />
              </div>
            </div>
            <div className="showcase-surface rounded-[28px] p-6">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-3 h-10 w-full" />
              <Skeleton className="mt-6 h-12 w-full" />
              <Skeleton className="mt-4 h-12 w-full" />
              <Skeleton className="mt-4 h-12 w-full" />
              <Skeleton className="mt-6 h-24 w-full rounded-[20px]" />
              <Skeleton className="mt-6 h-12 w-full rounded-2xl" />
            </div>
          </div>
          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
            <Skeleton className="aspect-[16/10] w-full rounded-[28px]" />
            <Skeleton className="h-[320px] w-full rounded-[28px]" />
          </div>
        </article>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
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
      </div>
    );
  }

  const images = getProjectImages(project.images, {
    coverUrl: project.cover_url,
    title: project.title,
  });
  const tools = project.project_tools ?? [];
  const description = (project.full_description || project.short_description || "").trim();
  const descriptionParagraphs = description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="container mx-auto max-w-6xl px-5 py-20 sm:px-6 md:px-8 md:py-24">
        <Link
          to="/portfolio"
          className="mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolio
        </Link>

        <section className="mb-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              {project.project_category ? (
                <Badge
                  variant="outline"
                  className="project-showcase-badge border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[hsl(var(--copy-foreground))]"
                >
                  {project.project_category.name}
                </Badge>
              ) : null}

              {images.length > 0 ? (
                <span className="project-showcase-meta-chip">
                  {images.length} image{images.length > 1 ? "s" : ""}
                </span>
              ) : null}
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.05em] md:text-6xl">
              {project.title}
            </h1>

            <p className="project-detail-lead mt-5 max-w-3xl text-lg leading-relaxed md:text-[1.35rem]">
              {project.short_description}
            </p>

            {project.key_metric ? (
              <div className="project-showcase-note mt-6 max-w-2xl rounded-[24px] p-5">
                <p className="project-showcase-metric text-base font-medium leading-relaxed md:text-[1.02rem]">
                  {project.key_metric}
                </p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              {project.demo_url ? (
                <Button variant="marketing" size="lg" asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Demo
                  </a>
                </Button>
              ) : null}
              {project.github_url ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/14 bg-white/[0.04] text-white hover:border-white/22 hover:bg-white/[0.08] hover:text-white"
                  asChild
                >
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          <aside className="showcase-surface rounded-[28px] p-6 xl:sticky xl:top-28">
            <h2 className="project-showcase-title text-xl font-semibold">
              Project Snapshot
            </h2>
            <p className="project-showcase-description mt-2 text-sm leading-relaxed">
              A quick read on scope, stack, and the next best step if you want something similar.
            </p>

            <div className="mt-6 space-y-4">
              <div className="project-detail-meta-row">
                <span className="project-detail-meta-label">Project type</span>
                <span className="project-detail-meta-value">
                  {project.project_category?.name || "Digital product"}
                </span>
              </div>
              <div className="project-detail-meta-row">
                <span className="project-detail-meta-label">Gallery</span>
                <span className="project-detail-meta-value">
                  {images.length > 0
                    ? `${images.length} visual${images.length > 1 ? "s" : ""}`
                    : "No visuals"}
                </span>
              </div>
              <div className="project-detail-meta-row">
                <span className="project-detail-meta-label">Build stack</span>
                <span className="project-detail-meta-value">
                  {tools.length > 0
                    ? `${tools.length} tool${tools.length > 1 ? "s" : ""}`
                    : "Custom stack"}
                </span>
              </div>
            </div>

            <div className="project-showcase-note mt-6 rounded-[22px] p-4 text-sm">
              Want a similar outcome? We can scope the fastest route to launch and suggest the right stack for it.
            </div>

            <Button variant="marketing" size="lg" className="mt-6 w-full" asChild>
              <Link to="/#contact">
                <Mail className="mr-2 h-5 w-5" />
                Request Similar Project
              </Link>
            </Button>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
          <div className="space-y-6">
            {images.length > 0 ? (
              <article className="showcase-surface overflow-hidden rounded-[28px]">
                <div className="flex items-center justify-between gap-4 p-6 pb-0">
                  <h2 className="project-showcase-title text-2xl font-semibold">
                    Project Gallery
                  </h2>

                  <span className="project-showcase-meta-chip shrink-0">
                    {activeSlide + 1}/{images.length}
                  </span>
                </div>

                <div className="p-5 pt-5">
                  <Carousel className="w-full" setApi={setCarouselApi}>
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index}>
                          <button
                            type="button"
                            className="media-hover-trigger group relative block aspect-[16/10] w-full overflow-hidden rounded-[24px] bg-muted text-left"
                            onClick={() => openLightbox(index)}
                          >
                            <img
                              src={image.url}
                              alt={image.alt || project.title}
                              className="project-showcase-image media-hover-target h-full w-full object-cover"
                              style={{ imageRendering: "auto" }}
                              loading="lazy"
                            />
                            <div className="project-showcase-image-overlay media-hover-overlay absolute inset-0 flex items-center justify-center">
                              <ExternalLink className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {images.length > 1 ? (
                      <>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                      </>
                    ) : null}
                  </Carousel>
                </div>
              </article>
            ) : null}

            <article className="showcase-surface rounded-[28px] p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="project-detail-icon-shell">
                  <LayoutPanelTop className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="project-showcase-title text-2xl font-semibold">
                    Project Overview
                  </h2>
                  <p className="project-showcase-description mt-1 text-sm leading-relaxed">
                    The current project information, presented in a cleaner case study layout.
                  </p>
                </div>
              </div>

              <div className="project-detail-body space-y-4">
                {descriptionParagraphs.length > 0 ? (
                  descriptionParagraphs.map((paragraph, index) => (
                    <p key={`${project.id}-paragraph-${index}`}>{paragraph}</p>
                  ))
                ) : (
                  <p>{project.short_description}</p>
                )}
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <article className="showcase-surface rounded-[28px] p-6 md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="project-detail-icon-shell">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="project-showcase-title text-2xl font-semibold">
                    Build Stack
                  </h2>
                  <p className="project-showcase-description mt-1 text-sm leading-relaxed">
                    Technologies used across the delivered product.
                  </p>
                </div>
              </div>

              {tools.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {tools.map((tool) => (
                    <div key={tool.id} className="project-detail-tool media-hover-trigger">
                      {tool.logo_path ? (
                        <img
                          src={getToolLogoUrl(tool.logo_path) || ""}
                          alt={tool.name}
                          className="media-hover-target h-8 w-8 rounded-[10px] bg-white object-contain p-1.5"
                        />
                      ) : (
                        <div className="project-detail-tool-fallback">
                          <Layers3 className="h-4 w-4" />
                        </div>
                      )}
                      <span className="text-sm font-medium">{tool.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="project-showcase-note rounded-[22px] p-4 text-sm">
                  Tool data has not been published for this project yet.
                </div>
              )}
            </article>

            <article className="showcase-surface rounded-[28px] p-6 md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="project-detail-icon-shell">
                  <Images className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="project-showcase-title text-2xl font-semibold">
                    Delivery Notes
                  </h2>
                  <p className="project-showcase-description mt-1 text-sm leading-relaxed">
                    A compact summary block that keeps the page aligned with the rest of the portfolio system.
                  </p>
                </div>
              </div>

              <div className="project-showcase-note rounded-[22px] p-4 text-sm">
                {project.key_metric ||
                  "This project page uses the current published content and presents it in a stronger editorial layout."}
              </div>

              <div className="mt-5 space-y-3">
                {project.demo_url ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/12 bg-white/[0.03] text-white hover:border-white/22 hover:bg-white/[0.08] hover:text-white"
                    asChild
                  >
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open live project
                    </a>
                  </Button>
                ) : null}
                {project.github_url ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/12 bg-white/[0.03] text-white hover:border-white/22 hover:bg-white/[0.08] hover:text-white"
                    asChild
                  >
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Open repository
                    </a>
                  </Button>
                ) : null}
              </div>
            </article>
          </div>
        </section>
      </article>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full border-white/8 bg-black/95 p-0">
          <div className="relative flex h-[90vh] w-full items-center justify-center">
            {images[lightboxIndex] ? (
              <img
                src={images[lightboxIndex].url}
                alt={images[lightboxIndex].alt || project.title}
                className="max-h-full max-w-full object-contain"
                style={{ imageRendering: "auto" }}
              />
            ) : null}

            {images.length > 1 ? (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                {lightboxIndex + 1} / {images.length}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
