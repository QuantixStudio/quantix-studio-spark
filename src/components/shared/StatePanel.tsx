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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/60 text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {action ? <div className={cn("flex w-full", align === "center" ? "justify-center" : "justify-start")}>{action}</div> : null}
      </CardContent>
    </Card>
  );
}
