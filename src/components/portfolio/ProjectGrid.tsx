import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen } from "lucide-react";
import { StatePanel } from "@/components/shared/StatePanel";
import { ProjectShowcaseCard } from "@/components/shared/ProjectShowcaseCard";

export default function ProjectGrid() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <section className="container mx-auto px-5 py-12 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="showcase-surface overflow-hidden rounded-[28px] p-5">
              <Skeleton className="aspect-[16/10] w-full rounded-[22px]" />
              <div className="space-y-4 px-1 pb-1 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-10 w-4/5" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-px w-full" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-16 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-5 py-12 sm:px-6 md:px-8">
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <ProjectShowcaseCard
              key={project.id}
              project={project}
              variant="portfolio"
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <StatePanel
          icon={FolderOpen}
          title="No projects published yet"
          description="This portfolio is ready for new case studies. Publish a project in the admin area and it will appear here automatically."
        />
      )}
    </section>
  );
}
