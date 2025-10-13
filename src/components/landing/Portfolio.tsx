import { useProjects } from "@/hooks/useProjects";
import ProjectCard from "./ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Portfolio() {
  const { data: projects, isLoading } = useProjects();

  return (
    <section id="portfolio" className="section-container">
      <div className="text-center mb-16">
        <h2 className="section-title">Our Portfolio</h2>
        <p className="section-subtitle">
          Explore projects we've built for clients around the world
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full h-64 rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects available at the moment.</p>
        </div>
      )}
    </section>
  );
}
