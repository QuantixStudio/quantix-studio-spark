import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturedProjects() {
  const { data: projects, isLoading } = useProjects(false, true);

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

  return (
    <section id="featured-work" className="section-container">
      <div className="text-center mb-16">
        <h2 className="section-title">Featured Work</h2>
        <p className="section-subtitle">Real results from real projects</p>
      </div>

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
    </section>
  );
}
