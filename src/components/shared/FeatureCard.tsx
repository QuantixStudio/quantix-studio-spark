import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  tools?: string;
  className?: string;
  align?: "left" | "center";
  contentClassName?: string;
  iconWrapperClassName?: string;
  titleWrapperClassName?: string;
  toolsWrapperClassName?: string;
  descriptionWrapperClassName?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  tools,
  className,
  align = "left",
  contentClassName,
  iconWrapperClassName,
  titleWrapperClassName,
  toolsWrapperClassName,
  descriptionWrapperClassName,
}: FeatureCardProps) {
  const isCentered = align === "center";

  return (
    <div className={cn("showcase-card icon-group-trigger media-hover-trigger h-full", className)}>
      <article className="showcase-surface feature-card-surface flex h-full flex-col overflow-hidden rounded-[28px]">
        <div className={cn("flex flex-col px-8 pb-7 pt-7 md:px-8 md:pb-7 md:pt-8", contentClassName)}>
          <div className={cn("mb-6 flex h-14 items-center", isCentered ? "justify-center" : "justify-start", iconWrapperClassName)}>
            <div className="feature-card-icon">{icon}</div>
          </div>

          <div className={cn("mb-3 flex items-start", isCentered ? "justify-center text-center" : "", titleWrapperClassName)}>
            <h3 className="feature-card-title text-xl font-semibold">{title}</h3>
          </div>

          <div className={cn("mb-3", isCentered ? "text-center" : "", toolsWrapperClassName)}>
            {tools ? <p className="feature-card-tools text-sm">{tools}</p> : null}
          </div>

          <div className={cn(isCentered ? "text-center" : "", descriptionWrapperClassName)}>
            <p className="feature-card-description text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </article>
    </div>
  );
}
