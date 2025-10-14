import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

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
    <section className="section-container">
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
            const mainImage = images[0]?.url;

            return (
              <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                <a
                  href={`/portfolio/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="overflow-hidden hover-lift">
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <ExternalLink className="h-5 w-5 text-white" />
                      </div>
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
                </a>
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
