import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminMetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}

export function AdminMetricCard({ title, value, description, icon: Icon }: AdminMetricCardProps) {
  return (
    <Card className="admin-surface">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="admin-metric-icon" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
