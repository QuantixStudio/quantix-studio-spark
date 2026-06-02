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
    <article className={cn("icon-group-trigger media-hover-trigger feature-card-surface flex h-full flex-col rounded-2xl", className)}>
      <div className={cn("flex flex-1 flex-col p-6", contentClassName)}>
        <div className={cn("mb-5 flex h-12 items-center", isCentered ? "justify-center" : "justify-start", iconWrapperClassName)}>
          <div className="feature-card-icon">{icon}</div>
        </div>

        <div className={cn("mb-3 flex min-h-12 items-start", isCentered ? "justify-center text-center" : "", titleWrapperClassName)}>
          <h3 className="feature-card-title text-xl font-semibold">{title}</h3>
        </div>

        <div className={cn("mb-3 min-h-8", isCentered ? "text-center" : "", toolsWrapperClassName)}>
          {tools ? <p className="feature-card-tools text-sm">{tools}</p> : null}
        </div>

        <div className={cn("flex-1", isCentered ? "text-center" : "", descriptionWrapperClassName)}>
          <p className="feature-card-description text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </article>
  );
}
