import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  tools?: string;
  className?: string;
  align?: "left" | "center";
}

export function FeatureCard({
  icon,
  title,
  description,
  tools,
  className,
  align = "left",
}: FeatureCardProps) {
  const isCentered = align === "center";

  return (
    <article className={cn("icon-group-trigger media-hover-trigger feature-card-surface flex h-full flex-col rounded-2xl", className)}>
      <div className="flex flex-1 flex-col p-8">
        <div className={cn("mb-6 flex h-12 items-center", isCentered ? "justify-center" : "justify-start")}>
          <div className="feature-card-icon">{icon}</div>
        </div>

        <div className={cn("mb-4 flex min-h-14 items-start", isCentered ? "justify-center text-center" : "")}>
          <h3 className="feature-card-title text-xl font-semibold">{title}</h3>
        </div>

        <div className={cn("mb-4 min-h-10", isCentered ? "text-center" : "")}>
          {tools ? <p className="feature-card-tools text-sm">{tools}</p> : null}
        </div>

        <div className={cn("flex-1", isCentered ? "text-center" : "")}>
          <p className="feature-card-description text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </article>
  );
}
