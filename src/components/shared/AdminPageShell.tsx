import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

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
  title,
  actionLabel,
  actionIcon: ActionIcon = Plus,
  onAction,
  isLoading = false,
  children,
}: AdminPageShellProps) {
  return (
    <section className="page-stack" aria-label={title}>
      {actionLabel && onAction ? (
        <div className="flex justify-end">
          <Button onClick={onAction}>
            <ActionIcon data-icon="inline-start" />
            {actionLabel}
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="admin-surface admin-loading-panel" aria-busy="true" aria-label={`${title} loading`}>
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        children
      )}
    </section>
  );
}
