import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getMainProjectImageUrl } from "@/lib/projectUtils";
import type { ProjectWithTools } from "@/types/app";

interface ProjectShowcaseCardProps {
  project: ProjectWithTools;
  className?: string;
}

export function ProjectShowcaseCard({
  project,
  className,
}: ProjectShowcaseCardProps) {
  const mainImage = getMainProjectImageUrl(project);
  const metric = project.key_metric?.trim();
  const toolsCount = project.project_tools?.length ?? 0;

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className={cn(
        "showcase-card project-showcase-card media-hover-trigger group block h-full",
        className,
      )}
    >
      <article className="showcase-surface project-showcase-surface flex h-full flex-col overflow-hidden rounded-[28px]">
        <div className="px-5 pt-5">
          <div className="project-showcase-media-shell relative aspect-[16/11] overflow-hidden rounded-[22px]">
            {mainImage ? (
              <img
                src={mainImage}
                alt={project.title}
                className="project-showcase-image media-hover-target h-full w-full object-cover"
                style={{ imageRendering: "auto" }}
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                No Image
              </div>
            )}
            <div className="project-showcase-image-overlay media-hover-overlay absolute inset-0" />
          </div>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
          <div className="mb-4 flex min-h-7 items-center gap-2">
            {project.project_category ? (
              <Badge
                variant="outline"
                className="project-showcase-badge border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[hsl(var(--copy-foreground))]"
              >
                {project.project_category.name}
              </Badge>
            ) : null}
          </div>

          <h3 className="project-showcase-title mb-3 text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em]">
            {project.title}
          </h3>

          <p className="project-showcase-description line-clamp-3 text-sm leading-relaxed md:text-[15px]">
            {project.short_description}
          </p>

          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            <div className="min-w-0">
              <p className="project-showcase-metric line-clamp-2 text-sm leading-relaxed">
                {metric || `${toolsCount || 1}+ tools used across the build`}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
