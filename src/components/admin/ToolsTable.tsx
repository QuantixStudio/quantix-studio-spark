import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/hooks/useTools";
import { deleteToolLogo, getToolLogoUrl } from "@/lib/toolStorageUtils";
import { format } from "date-fns";

interface ToolsTableProps {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Frontend':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'Backend':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'Database':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'AI':
      return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
    case 'Automation':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    case 'Design':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'CMS':
      return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    case 'Email & Marketing':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'Analytics':
      return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
    case 'CRM / Business Tools':
      return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
    case 'Mobile':
      return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
    case 'SaaS':
      return 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20';
    case 'Full-stack':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

export default function ToolsTable({ tools, onEdit }: ToolsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleEdit = async (toolId: string) => {
    const { data, error } = await supabase
      .from("tools" as any)
      .select("*")
      .eq("id", toolId)
      .single();

    if (error) {
      toast.error("Failed to fetch tool details");
      return;
    }

    onEdit(data as unknown as Tool);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const tool = tools.find((t) => t.id === deleteId);

      if (tool?.logo_path) {
        await deleteToolLogo(tool.logo_path);
      }

      const { error } = await supabase.from("tools" as any).delete().eq("id", deleteId);

      if (error) throw error;

      toast.success("Tool deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete tool");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (tools.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No tools found. Add your first tool to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell>
                  {tool.logo_path ? (
                    <img
                      src={getToolLogoUrl(tool.logo_path) || ""}
                      alt={tool.name}
                      className="w-12 h-12 object-contain rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      No logo
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{tool.name}</TableCell>
                <TableCell>
                  {tool.categories && tool.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {tool.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className={getCategoryColor(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No categories</span>
                  )}
                </TableCell>
                <TableCell>
                  {tool.is_featured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(tool.updated_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(tool.id)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(tool.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
