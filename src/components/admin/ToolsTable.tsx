import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { getErrorMessage } from "@/lib/errorUtils";
import { formatUiDate } from "@/lib/date";
import { deleteToolLogo, getToolLogoUrl } from "@/lib/toolStorageUtils";
import { StatePanel } from "@/components/shared/StatePanel";
import { RowActionsMenu } from "@/components/shared/RowActionsMenu";
import type { Tool } from "@/types/app";

interface ToolsTableProps {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
}

export default function ToolsTable({ tools, onEdit }: ToolsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const adminStatusBadgeClassName = "rounded-[5px] px-5 py-1.5 text-sm font-semibold";
  const logoFrameClassName = "flex h-12 w-12 items-center justify-center overflow-hidden rounded-[10px] border border-border/60 bg-white p-1";

  const handleEdit = async (toolId: string) => {
    const toolQuery = supabase.from("tools") as unknown as {
      select: (columns: string) => {
        eq: (
          column: string,
          value: string,
        ) => {
          single: () => Promise<{ data: Tool | null; error: Error | null }>;
        };
      };
    };

    const { data, error } = await toolQuery
      .select(`
        id,
        name,
        slug,
        description,
        website_url,
        logo_path,
        is_featured,
        created_at,
        updated_at
      `)
      .eq("id", toolId)
      .single();

    if (error) {
      toast.error("Failed to fetch tool details");
      return;
    }

    if (!data) {
      toast.error("Tool details are unavailable");
      return;
    }

    onEdit(data);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const tool = tools.find((t) => t.id === deleteId);

      if (tool?.logo_path) {
        await deleteToolLogo(tool.logo_path);
      }

      const { error } = await supabase.from("tools").delete().eq("id", deleteId);

      if (error) throw error;

      toast.success("Tool deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-system", "technologies"] });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(getErrorMessage(error, "Failed to delete tool"));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (tools.length === 0) {
    return (
      <StatePanel
        title="No tools yet"
        description="Add the platforms and services you actively use so project cards, logos, and featured stack sections stay up to date."
      />
    );
  }

  return (
    <>
      <div className="table-shell">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell>
                  {tool.logo_path ? (
                    <div className={logoFrameClassName}>
                      <img
                        src={getToolLogoUrl(tool.logo_path) || ""}
                        alt={tool.name}
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
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <p>{tool.name}</p>
                    {tool.description ? (
                      <p className="max-w-xs text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs text-muted-foreground">{tool.slug}</code>
                </TableCell>
                <TableCell>
                  {tool.is_featured ? (
                    <Badge variant="default" className={adminStatusBadgeClassName}>Featured</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">No</span>
                  )}
                </TableCell>
                <TableCell>
                  {tool.website_url ? (
                    <a
                      href={tool.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Open site
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">No website</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatUiDate(tool.updated_at)}
                </TableCell>
                <TableCell>
                  <RowActionsMenu
                    onEdit={() => handleEdit(tool.id)}
                    onDelete={() => setDeleteId(tool.id)}
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
            <AlertDialogTitle>Delete Tool</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tool? This action cannot be undone.
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
