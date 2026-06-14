import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getMainProjectImageUrl } from "@/lib/projectUtils";
import type { ProjectWithTools } from "@/types/app";

interface ProjectShowcaseCardProps {
  project: ProjectWithTools;
  className?: string;
  variant?: "featured" | "portfolio";
}

export function ProjectShowcaseCard({
  project,
  className,
  variant = "featured",
}: ProjectShowcaseCardProps) {
  const mainImage = getMainProjectImageUrl(project);
  const metric = project.key_metric?.trim();
  const tools = project.project_tools ?? [];
  const toolsCount = tools.length;
  const visibleTools = tools.slice(0, variant === "portfolio" ? 4 : 3);
  const remainingToolsCount = Math.max(toolsCount - visibleTools.length, 0);
  const summaryLabel = metric || `${toolsCount || 1}+ tools used across the build`;
  const metaLabel = toolsCount > 0 ? `${toolsCount} tool${toolsCount > 1 ? "s" : ""}` : "Case study";
  const isPortfolioCard = variant === "portfolio";

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
          <div
            className={cn(
              "project-showcase-media-shell relative overflow-hidden rounded-[22px]",
              isPortfolioCard ? "aspect-[16/10]" : "aspect-[16/11]",
            )}
          >
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
          <div className="mb-4 flex min-h-7 items-center justify-between gap-3">
            {project.project_category ? (
              <Badge
                variant="outline"
                className="project-showcase-badge border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[hsl(var(--copy-foreground))]"
              >
                {project.project_category.name}
              </Badge>
            ) : null}

            {isPortfolioCard ? (
              <span className="project-showcase-meta-chip shrink-0">
                {metaLabel}
              </span>
            ) : null}
          </div>

          <h3
            className={cn(
              "project-showcase-title mb-3 font-semibold leading-[1.02] tracking-[-0.04em]",
              isPortfolioCard
                ? "text-[2rem] md:text-[2.15rem]"
                : "text-[2rem]",
            )}
          >
            {project.title}
          </h3>

          <p className="project-showcase-description line-clamp-3 text-sm leading-relaxed md:text-[15px]">
            {project.short_description}
          </p>

          {isPortfolioCard ? (
            <div className="mt-auto pt-6">
              <div className="project-showcase-note mb-4 rounded-[20px] p-4 text-sm leading-relaxed">
                <p className="project-showcase-metric min-w-0">
                  {summaryLabel}
                </p>
              </div>

              {visibleTools.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {visibleTools.map((tool) => (
                    <span key={tool.id} className="project-showcase-tool-chip">
                      {tool.name}
                    </span>
                  ))}
                  {remainingToolsCount > 0 ? (
                    <span className="project-showcase-tool-chip">
                      +{remainingToolsCount}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-auto flex items-end justify-between gap-4 pt-6">
              <div className="min-w-0">
                <p className="project-showcase-metric line-clamp-2 text-sm leading-relaxed">
                  {summaryLabel}
                </p>
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
