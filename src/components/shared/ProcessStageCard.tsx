import type { LucideIcon } from "lucide-react";

import { IconGroupBadge } from "@/components/shared/IconGroupBadge";
import { cn } from "@/lib/utils";

interface ProcessStageCardProps {
  icon: LucideIcon;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  className?: string;
}

export function ProcessStageCard({
  icon,
  number,
  title,
  subtitle,
  description,
  className,
}: ProcessStageCardProps) {
  return (
    <div className={cn("showcase-card icon-group-trigger media-hover-trigger h-full", className)}>
      <article className="showcase-surface process-stage-card flex h-full flex-col overflow-hidden rounded-[28px] p-7 md:p-8">
        <span className="process-stage-number">{number}</span>

        <div className="mb-7">
          <IconGroupBadge icon={icon} className="shrink-0" />
        </div>

        <div className="mb-4 pr-20">
          <h3 className="process-stage-title text-2xl font-semibold leading-tight">{title}</h3>
        </div>

        <div className="mb-5">
          <p className="process-stage-subtitle text-sm">{subtitle}</p>
        </div>

        <div className="flex-1">
          <p className="process-stage-description text-base leading-relaxed">{description}</p>
        </div>
      </article>
    </div>
  );
}
