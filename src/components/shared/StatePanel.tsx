import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatePanelProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  align?: "center" | "left";
}

export function StatePanel({
  title,
  description,
  action,
  icon: Icon = Inbox,
  className,
  align = "center",
}: StatePanelProps) {
  return (
    <Card className={cn("admin-surface border-dashed", className)}>
      <CardContent
        className={cn(
          "flex gap-4 px-6 py-10 sm:px-10",
          align === "center" ? "flex-col items-center text-center" : "flex-col text-left sm:flex-row sm:items-start",
        )}
      >
        <div className="state-panel-icon">
          <Icon aria-hidden="true" />
        </div>
        <div className="content-stack-sm">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {action ? <div className={cn("flex w-full", align === "center" ? "justify-center" : "justify-start")}>{action}</div> : null}
      </CardContent>
    </Card>
  );
}
