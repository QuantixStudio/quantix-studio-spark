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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RowActionsMenu } from "@/components/shared/RowActionsMenu";
import { StatePanel } from "@/components/shared/StatePanel";
import { formatUiDateTime } from "@/lib/date";
import { getErrorMessage } from "@/lib/errorUtils";
import type { AdminContentItem, ContentTab } from "@/types/app";

interface ContentItemsTableProps {
  items: AdminContentItem[];
  tab: Extract<ContentTab, "how-we-work" | "why-choose-us">;
  onEdit: (item: AdminContentItem) => void;
}

const tableLabels = {
  "how-we-work": {
    singular: "step",
    title: "No process steps yet",
    description: "Add the stages that explain how the team works from discovery through launch.",
  },
  "why-choose-us": {
    singular: "item",
    title: "No value props yet",
    description: "Add the trust-building points that power the Why Choose Us section on the landing page.",
  },
} as const;

export default function ContentItemsTable({ items, tab, onEdit }: ContentItemsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const label = tableLabels[tab];

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const { error } = await (supabase as unknown as { from: (table: string) => any })
        .from(tab === "how-we-work" ? "how_we_work" : "why_choose_us")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success(`${label.singular[0].toUpperCase()}${label.singular.slice(1)} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin-content", tab] });
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to delete ${label.singular}`));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (items.length === 0) {
    return <StatePanel title={label.title} description={label.description} />;
  }

  return (
    <>
      <div className="table-shell">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title || "Untitled item"}</TableCell>
                <TableCell>
                  <p className="max-w-xl text-sm text-muted-foreground line-clamp-2">
                    {item.description || "No description"}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.order ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatUiDateTime(item.created_at)}</TableCell>
                <TableCell>
                  <RowActionsMenu onEdit={() => onEdit(item)} onDelete={() => setDeleteId(item.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {label.singular}</AlertDialogTitle>
            <AlertDialogDescription>
              This action removes the selected {label.singular} from the content hub and the public site source.
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
