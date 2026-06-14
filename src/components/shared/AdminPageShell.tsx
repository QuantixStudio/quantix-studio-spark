import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminPageShellProps {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  isLoading?: boolean;
  children: ReactNode;
}

export function AdminPageShell({
  eyebrow = "Content management",
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon = Plus,
  onAction,
  isLoading = false,
  children,
}: AdminPageShellProps) {
  return (
    <section className="page-stack" aria-labelledby={`${title.toLowerCase().replace(/\s+/g, "-")}-page-title`}>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        titleId={`${title.toLowerCase().replace(/\s+/g, "-")}-page-title`}
        description={description}
        actions={
          actionLabel && onAction ? (
            <Button onClick={onAction}>
              <ActionIcon data-icon="inline-start" />
              {actionLabel}
            </Button>
          ) : null
        }
      />

      {isLoading ? (
        <div className="admin-surface admin-loading-panel" aria-busy="true" aria-label={`${title} loading`}>
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        children
      )}
    </section>
  );
}
