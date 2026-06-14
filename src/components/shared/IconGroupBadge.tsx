import { type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface IconGroupBadgeProps {
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
  iconClassName?: string;
}

export function IconGroupBadge({ icon: Icon, children, className, iconClassName }: IconGroupBadgeProps) {
  return (
    <div className={cn("icon-group inline-flex", className)}>
      <div className="icon-group-badge media-hover-target inline-flex h-16 w-16 items-center justify-center rounded-full">
        {children ?? (Icon ? <Icon className={cn("icon-group-badge-icon media-hover-item h-8 w-8", iconClassName)} /> : null)}
      </div>
    </div>
  );
}
