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
import { Button } from "@/components/ui/button";
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
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  cover_url: string | null;
  published: boolean;
  created_at: string;
  project_category: { name: string } | null;
}

interface ProjectsTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
}

export default function ProjectsTable({ projects, onEdit }: ProjectsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No projects found</p>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {project.cover_url ? (
                      <img
                        src={project.cover_url}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.project_category?.name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={project.published ? "default" : "secondary"}>
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(project.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => onEdit(project)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteId(project.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be
              undone.
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
