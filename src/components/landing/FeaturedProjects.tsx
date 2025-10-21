import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function FeaturedProjects() {
  const { data: projects, isLoading } = useProjects(false, true);
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <section className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle">Real results from real projects</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (!projects?.length) return null;

  // Limit projects on mobile to prevent overly long page
  const displayProjects = isMobile ? projects.slice(0, 3) : projects;

  return (
    <section id="featured-work" className="section-container">
      <FadeInUp>
        <div className="text-center mb-16">
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle">Real results from real projects</p>
        </div>
      </FadeInUp>

      {/* MOBILE VIEW: Vertical Stack */}
      {isMobile ? (
        <>
          <StaggerContainer className="space-y-6 max-w-lg mx-auto" staggerDelay={0.15}>
            {displayProjects.map((project) => {
              const images = project.images && Array.isArray(project.images) && project.images.length > 0
                ? project.images
                : project.cover_url
                ? [{ url: project.cover_url, alt: project.title, is_main: true, order: 0 }]
                : [];
              const mainImage = images.find((img: any) => img.is_main)?.url || images[0]?.url;

              return (
                <StaggerItem key={project.id}>
                  <Link
                    to={`/portfolio/${project.slug}`}
                    className="block group"
                  >
                    <Card className="overflow-hidden border transition-colors hover:border-accent">
                      <div className="relative aspect-video bg-muted overflow-hidden">
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

                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>

                        {project.key_metric && (
                          <p className="text-accent font-medium text-sm">
                            {project.key_metric}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
          
          {/* "View More Projects" button - mobile only */}
          <FadeInUp delay={0.5}>
            <div className="mt-8 text-center">
              <Link to="/portfolio">
                <Button size="lg" className="w-full sm:w-auto">
                  View More Projects
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </>
      ) : (
        /* DESKTOP VIEW: Carousel with Arrows */
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {projects.map((project) => {
              const images = project.images && Array.isArray(project.images) && project.images.length > 0
                ? project.images
                : project.cover_url
                ? [{ url: project.cover_url, alt: project.title, is_main: true, order: 0 }]
                : [];
              const mainImage = images.find((img: any) => img.is_main)?.url || images[0]?.url;

              return (
                <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                  <Link
                    to={`/portfolio/${project.slug}`}
                    className="block group"
                  >
                    <Card className="overflow-hidden border transition-colors hover:border-accent">
                      <div className="relative aspect-video bg-muted overflow-hidden">
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

                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>

                        {project.key_metric && (
                          <p className="text-accent font-medium text-sm">
                            {project.key_metric}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </section>
  );
}
