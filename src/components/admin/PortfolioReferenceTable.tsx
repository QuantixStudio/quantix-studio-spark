import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RowActionsMenu } from "@/components/shared/RowActionsMenu";
import { StatePanel } from "@/components/shared/StatePanel";
import { formatUiDateTime } from "@/lib/date";
import { getErrorMessage } from "@/lib/errorUtils";
import { deleteToolLogo, getToolLogoUrl } from "@/lib/toolStorageUtils";
import type {
  AdminPortfolioStatus,
  AdminProjectCategory,
  AdminTechnology,
  PortfolioStatusTab,
} from "@/types/app";

type PortfolioReferenceTab = "technologies" | "categories" | PortfolioStatusTab;
type ReferenceItem = AdminTechnology | AdminProjectCategory | AdminPortfolioStatus;

interface PortfolioReferenceTableProps {
  tab: PortfolioReferenceTab;
  items: ReferenceItem[];
  onEdit: (item: ReferenceItem) => void;
}

const tableConfig = {
  technologies: {
    tableName: "technologies",
    queryKey: ["portfolio-system", "technologies"] as const,
    singular: "technology",
    emptyTitle: "No technologies yet",
    emptyDescription: "Add the stack items your projects can reference in portfolio cards and project detail views.",
  },
  categories: {
    tableName: "project_category",
    queryKey: ["portfolio-system", "categories"] as const,
    singular: "category",
    emptyTitle: "No categories yet",
    emptyDescription: "Add portfolio categories to keep project organization and filtering consistent.",
  },
  "project-statuses": {
    tableName: "project_status",
    queryKey: ["portfolio-system", "project-statuses"] as const,
    singular: "project status",
    emptyTitle: "No project statuses yet",
    emptyDescription: "Add workflow states used by the project admin experience and portfolio management.",
  },
  "task-statuses": {
    tableName: "task_status",
    queryKey: ["portfolio-system", "task-statuses"] as const,
    singular: "task status",
    emptyTitle: "No task statuses yet",
    emptyDescription: "Add task states used by the internal delivery workflow for project tasks.",
  },
} as const;

function getUsageLabel(tab: PortfolioReferenceTab, count: number) {
  if (tab === "technologies") {
    return `${count} project tech link${count === 1 ? "" : "s"}`;
  }

  if (tab === "categories") {
    return `${count} project${count === 1 ? "" : "s"}`;
  }

  return `${count} linked row${count === 1 ? "" : "s"}`;
}

function renderColorSwatch(color: string | null) {
  if (!color) {
    return <span className="text-xs text-muted-foreground">No color</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="h-3.5 w-3.5 rounded-full border border-white/10"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <code className="text-xs text-muted-foreground">{color}</code>
    </div>
  );
}

export default function PortfolioReferenceTable({ tab, items, onEdit }: PortfolioReferenceTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const config = tableConfig[tab];

  const itemToDelete = items.find((item) => item.id === deleteId) ?? null;

  const handleDeleteClick = (item: ReferenceItem) => {
    if (item.usage_count > 0) {
      toast.error(`Can't delete this ${config.singular} while it is still in use.`);
      return;
    }

    setDeleteId(item.id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const deletingTechnology = tab === "technologies"
        ? ((itemToDelete as AdminTechnology | null) ?? null)
        : null;

      const { error } = await (supabase as unknown as { from: (table: string) => any })
        .from(config.tableName)
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      if (deletingTechnology?.logo_path) {
        await deleteToolLogo(deletingTechnology.logo_path);
      }

      toast.success(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: config.queryKey });
      queryClient.invalidateQueries({ queryKey: ["technologies", "public"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to delete ${config.singular}`));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (items.length === 0) {
    return <StatePanel title={config.emptyTitle} description={config.emptyDescription} />;
  }

  const isStatusTable = tab === "project-statuses" || tab === "task-statuses";
  const isTechnologyTable = tab === "technologies";

  return (
    <>
      <div className="table-shell">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              {isTechnologyTable ? <TableHead className="w-20">Logo</TableHead> : null}
              <TableHead>{isStatusTable ? "ID / Label" : "Name"}</TableHead>
              <TableHead>{isTechnologyTable ? "Slug / Description" : isStatusTable ? "Color" : "Description"}</TableHead>
              <TableHead>{isStatusTable || tab === "categories" ? "Order" : "Created"}</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {isTechnologyTable ? (
                  <TableCell>
                    {(item as AdminTechnology).logo_path ? (
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[10px] border border-border/60 bg-white p-1">
                        <img
                          src={getToolLogoUrl((item as AdminTechnology).logo_path ?? null) || ""}
                          alt={(item as AdminTechnology).name}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-border/60 bg-muted text-[10px] text-muted-foreground">
                        No logo
                      </div>
                    )}
                  </TableCell>
                ) : null}
                <TableCell className="font-medium">
                  {"name" in item ? (
                    <div className="space-y-1">
                      <p>{item.name || "Unnamed"}</p>
                      {isTechnologyTable ? null : (
                        <code className="text-xs text-muted-foreground">{item.id}</code>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <code className="text-xs text-muted-foreground">{item.id}</code>
                      <p>{item.label || "Untitled status"}</p>
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {isTechnologyTable ? (
                    <div className="space-y-1">
                      <code className="text-xs text-muted-foreground">{(item as AdminTechnology).slug}</code>
                      <p className="max-w-xl text-xs text-muted-foreground line-clamp-2">
                        {(item as AdminTechnology).description || "No description"}
                      </p>
                    </div>
                  ) : isStatusTable ? (
                    renderColorSwatch((item as AdminPortfolioStatus).color)
                  ) : (
                    <p className="max-w-xl text-sm text-muted-foreground line-clamp-2">
                      {(item as AdminProjectCategory).description || "No description"}
                    </p>
                  )}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {isStatusTable
                    ? ((item as AdminPortfolioStatus).order_index ?? "—")
                    : tab === "categories"
                      ? ((item as AdminProjectCategory).order_index ?? "—")
                      : formatUiDateTime((item as AdminTechnology).created_at)}
                </TableCell>

                <TableCell>
                  <Badge variant={item.usage_count > 0 ? "secondary" : "outline"}>
                    {getUsageLabel(tab, item.usage_count)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <RowActionsMenu
                    onEdit={() => onEdit(item)}
                    onDelete={() => handleDeleteClick(item)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {config.singular}</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete
                ? `This ${config.singular} is not currently in use and can be deleted safely.`
                : `Delete the selected ${config.singular}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
