import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  tools?: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, tools, className }: FeatureCardProps) {
  return (
    <article className={cn("feature-card-surface flex h-full flex-col rounded-2xl", className)}>
      <div className="flex flex-1 flex-col p-8">
        <div className="mb-6 flex h-12 items-center">
          <div className="feature-card-icon">{icon}</div>
        </div>

        <div className="mb-4 flex min-h-14 items-start">
          <h3 className="feature-card-title text-xl font-semibold">{title}</h3>
        </div>

        <div className="mb-4 min-h-10">
          {tools ? <p className="feature-card-tools text-sm">{tools}</p> : null}
        </div>

        <div className="flex-1">
          <p className="feature-card-description text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </article>
  );
}
