import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface IconGroupBadgeProps {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}

export function IconGroupBadge({ icon: Icon, className, iconClassName }: IconGroupBadgeProps) {
  return (
    <div className={cn("icon-group inline-flex", className)}>
      <div className="icon-group-badge inline-flex h-16 w-16 items-center justify-center rounded-full">
        <Icon className={cn("icon-group-badge-icon h-8 w-8", iconClassName)} />
      </div>
    </div>
  );
}
