import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errorUtils";
import { getMainProjectImageUrl, mapProjectWithTools } from "@/lib/projectUtils";
import { deleteAllProjectImages } from "@/lib/storageUtils";
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
import { StatePanel } from "@/components/shared/StatePanel";
import type { EditableProject, ProjectWithTools, RawProjectWithCategory, Tool } from "@/types/app";

interface ProjectsTableProps {
  projects: ProjectWithTools[];
  onEdit: (project: EditableProject) => void;
}

interface ProjectImageRelation {
  public_url: string | null;
  alt: string | null;
  is_main: boolean | null;
  order_index: number | null;
}

export default function ProjectsTable({ projects, onEdit }: ProjectsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const queryClient = useQueryClient();

  const handleEdit = async (projectId: string) => {
    setIsFetching(true);
    try {
      const { data: projectData, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_category:project_category!projects_category_id_fkey (
            id,
            name,
            description
          ),
          cover_image:project_images!projects_cover_image_id_fkey (
            public_url,
            alt,
            is_main,
            order_index
          ),
          project_images:project_images!project_images_project_fk (
            public_url,
            alt,
            is_main,
            order_index
          )
        `)
        .eq("id", projectId)
        .single();

      if (error) throw error;

      const [{ data: projectTech, error: projectTechError }, { data: allToolsData, error: allToolsError }] =
        await Promise.all([
          supabase
            .from("project_technologies")
            .select(`
              technology_id,
              technologies:technologies!fk_pt_technology (
                id,
                name
              )
            `)
            .eq("project_id", projectId),
          supabase.from("technologies").select("id, name"),
        ]);

      if (projectTechError) throw projectTechError;
      if (allToolsError) throw allToolsError;

      const toolIds = ((projectTech ?? []) as Array<{
        technologies: { id: string; name: string } | { id: string; name: string }[] | null;
      }>)
        .map((row) => {
          const technology = row.technologies;
          return Array.isArray(technology) ? technology[0] : technology;
        })
        .filter((technology): technology is { id: string; name: string } => Boolean(technology?.id))
        .map((technology) => technology.id);

      const allTools = ((allToolsData ?? []) as Array<{ id: string; name: string }>).map((technology) => ({
        id: technology.id,
        name: technology.name,
        slug: technology.name.toLowerCase().replace(/\s+/g, "-"),
        description: null,
        website_url: null,
        logo_path: null,
        is_featured: false,
        created_at: null,
        updated_at: null,
      })) as Tool[];
      const projectTools = allTools.filter((tool) => toolIds.includes(tool.id));
      const relatedImages = [
        ...(((projectData as { project_images?: ProjectImageRelation[] | null }).project_images ?? []).filter(
          (image): image is ProjectImageRelation => Boolean(image?.public_url),
        )),
      ]
        .map((image, index) => ({
          url: image.public_url ?? "",
          alt: image.alt ?? projectData.title,
          is_main: image.is_main ?? index === 0,
          order: image.order_index ?? index,
        }))
        .sort((left, right) => left.order - right.order);
      const normalizedImages = relatedImages.length > 0 ? relatedImages : [];
      const coverRelation = (projectData as { cover_image?: ProjectImageRelation | ProjectImageRelation[] | null }).cover_image;
      const coverImage = Array.isArray(coverRelation) ? coverRelation[0] : coverRelation;
      const editorProject = {
        ...(projectData as RawProjectWithCategory),
        images: normalizedImages,
        cover_url:
          normalizedImages.find((image) => image.is_main)?.url ??
          normalizedImages[0]?.url ??
          coverImage?.public_url ??
          null,
      };

      onEdit(mapProjectWithTools(editorProject, projectTools));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load project"));
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteAllProjectImages(deleteId);

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setDeleteId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete project"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {projects.length === 0 ? (
        <StatePanel
          title="No projects yet"
          description="Create your first project to populate the public portfolio and featured work sections."
        />
      ) : (
      <div className="table-shell">
        <Table className="min-w-[720px]">
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
            {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {getMainProjectImageUrl(project) ? (
                      <img
                        src={getMainProjectImageUrl(project) ?? ""}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <p>{project.title}</p>
                      <p className="max-w-xs text-xs text-muted-foreground line-clamp-2">{project.short_description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{project.project_category?.name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={project.published ? "default" : "secondary"}>
                      {project.project_status?.label || (project.published ? "Published" : "Draft")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {project.created_at ? new Date(project.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => handleEdit(project.id)} disabled={isFetching}>
                          <Pencil className="w-4 h-4 mr-2" />
                          {isFetching ? "Loading..." : "Edit"}
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
              ))}
          </TableBody>
        </Table>
      </div>
      )}

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
