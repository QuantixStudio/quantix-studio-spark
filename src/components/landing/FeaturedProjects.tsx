import { useProjects } from "@/hooks/useProjects";
import { Link } from "react-router-dom";
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
import { ProjectShowcaseCard } from "@/components/shared/ProjectShowcaseCard";
import { trackEvent } from "@/lib/analytics";

export default function FeaturedProjects() {
  const { data: projects, isLoading, isError } = useProjects(false, true);
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
            <Skeleton key={i} className="h-[460px] w-full rounded-[28px]" />
          ))}
        </div>
      </section>
    );
  }

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

      {isError ? (
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/60 p-8 text-center text-muted-foreground">
          Featured projects could not be loaded from Supabase.
        </div>
      ) : !projects?.length ? (
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/60 p-8 text-center text-muted-foreground">
          No featured rows found in the <code>projects</code> table.
        </div>
      ) : isMobile ? (
        /* MOBILE VIEW: Vertical Stack */
        <>
          <StaggerContainer className="space-y-6 max-w-lg mx-auto" staggerDelay={0.15}>
            {displayProjects.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectShowcaseCard project={project} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          {/* "View More Projects" button - mobile only */}
          <FadeInUp delay={0.5}>
            <div className="mt-8 text-center">
              <Link
                to="/portfolio"
                onClick={() =>
                  trackEvent("portfolio_cta_click", {
                    event_category: "portfolio",
                    source: "featured_projects_mobile",
                  })
                }
              >
                <Button variant="marketing" size="lg" className="w-full sm:w-auto">
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
          className="mx-auto w-full max-w-6xl"
        >
          <CarouselContent>
            {projects.map((project) => (
              <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                <ProjectShowcaseCard project={project} className="h-full" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="md:-left-6 lg:-left-16" />
          <CarouselNext className="md:-right-6 lg:-right-16" />
        </Carousel>
      )}
    </section>
  );
}
