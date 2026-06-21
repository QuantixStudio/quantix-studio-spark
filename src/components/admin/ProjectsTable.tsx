import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatUiDate } from "@/lib/date";
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
import { StatePanel } from "@/components/shared/StatePanel";
import { RowActionsMenu } from "@/components/shared/RowActionsMenu";
import type {
  ClientSummary,
  EditableProject,
  ProjectFileSummary,
  ProjectServiceSummary,
  ProjectStatusSummary,
  ProjectTaskSummary,
  ProjectWithTools,
  RawProjectWithCategory,
  TaskStatusSummary,
  Tool,
} from "@/types/app";

const untypedSupabase = supabase as unknown as {
  from: (relation: string) => any;
};

interface ProjectsTableProps {
  projects: ProjectWithTools[];
  onEdit: (project: EditableProject) => void;
}

interface ProjectImageRelation {
  id: string;
  file_path: string | null;
  public_url: string | null;
  alt: string | null;
  is_main: boolean | null;
  order_index: number | null;
}

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  created_at: string | null;
  status: string | null;
}

export default function ProjectsTable({ projects, onEdit }: ProjectsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const queryClient = useQueryClient();
  const adminStatusBadgeClassName = "rounded-[5px] px-5 py-1.5 text-sm font-semibold";
  const neutralReferenceBadgeClassName = `${adminStatusBadgeClassName} border-border/70 bg-background/70 text-foreground`;

  const handleEdit = async (project: ProjectWithTools) => {
    setIsFetching(true);
    try {
      const { data: projectData, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", project.id)
        .single();

      if (error) throw error;

      const projectRecord = {
        ...(projectData as unknown as RawProjectWithCategory),
        project_category: project.project_category ?? null,
      };

      const settledQueries = await Promise.allSettled([
        untypedSupabase
          .from("project_images")
          .select("id, file_path, public_url, alt, is_main, order_index")
          .eq("project_id", project.id)
          .order("order_index", { ascending: true }),
        untypedSupabase
          .from("project_technologies")
          .select("technology_id")
          .eq("project_id", project.id),
        supabase.from("technologies").select("id, name"),
        untypedSupabase
          .from("project_services")
          .select("service_id")
          .eq("project_id", project.id),
        untypedSupabase
          .from("project_files")
          .select("id, file_url, file_type, order_index, created_at")
          .eq("project_id", project.id)
          .order("order_index", { ascending: true }),
        untypedSupabase
          .from("project_tasks")
          .select("id, title, description, due_date, created_at, status")
          .eq("project_id", project.id)
          .order("created_at", { ascending: false }),
        projectRecord.status
          ? untypedSupabase
              .from("project_status")
              .select("id, label, color, order_index")
              .eq("id", projectRecord.status)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        projectRecord.client_id
          ? untypedSupabase
              .from("clients")
              .select("id, name, email, company, status")
              .eq("id", projectRecord.client_id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),
      ]);

      const readQueryResult = <T,>(
        result: PromiseSettledResult<{ data: T; error: unknown }>,
        label: string,
      ): T | null => {
        if (result.status === "rejected") {
          console.warn(`Could not load ${label} for project ${project.id}`, result.reason);
          return null;
        }

        if (result.value.error) {
          console.warn(`Could not load ${label} for project ${project.id}`, result.value.error);
          return null;
        }

        return result.value.data;
      };

      const projectImagesData = readQueryResult<ProjectImageRelation[]>(
        settledQueries[0],
        "project images",
      );
      const projectTechRows = readQueryResult<Array<{ technology_id: string | null }>>(
        settledQueries[1],
        "project technologies",
      );
      const allToolsData = readQueryResult<Array<{ id: string; name: string }>>(
        settledQueries[2],
        "technologies catalog",
      );
      const projectServiceLinks = readQueryResult<Array<{ service_id: string | null }>>(
        settledQueries[3],
        "project services",
      );
      const projectFileRows = readQueryResult<ProjectFileSummary[]>(
        settledQueries[4],
        "project files",
      );
      const projectTaskRows = readQueryResult<TaskRow[]>(
        settledQueries[5],
        "project tasks",
      );
      const projectStatusRow = readQueryResult<ProjectStatusSummary | null>(
        settledQueries[6],
        "project status",
      );
      const clientRow = readQueryResult<ClientSummary | null>(
        settledQueries[7],
        "project client",
      );

      const toolIds = (projectTechRows ?? [])
        .map((row) => row.technology_id)
        .filter((technologyId): technologyId is string => Boolean(technologyId));

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

      const serviceIds = (projectServiceLinks ?? [])
        .map((row) => row.service_id)
        .filter((serviceId): serviceId is string => Boolean(serviceId));
      let projectServices: ProjectServiceSummary[] = [];

      if (serviceIds.length > 0) {
        const { data: serviceRows, error: servicesError } = await supabase
          .from("services")
          .select("id, title, description")
          .in("id", serviceIds);

        if (servicesError) {
          console.warn(`Could not load services catalog for project ${project.id}`, servicesError);
        } else {
          projectServices = (serviceRows ?? []) as ProjectServiceSummary[];
        }
      }

      const projectFiles = (projectFileRows ?? []).filter((file) => Boolean(file.id));
      const taskStatusIds = Array.from(
        new Set((projectTaskRows ?? []).map((task) => task.status).filter((status): status is string => Boolean(status))),
      );
      let taskStatusMap = new Map<string, TaskStatusSummary>();

      if (taskStatusIds.length > 0) {
        const { data: taskStatusRows, error: taskStatusError } = await untypedSupabase
          .from("task_status")
          .select("id, label, color, order_index")
          .in("id", taskStatusIds);

        if (taskStatusError) throw taskStatusError;

        taskStatusMap = new Map(
          ((taskStatusRows ?? []) as TaskStatusSummary[]).map((status) => [status.id, status]),
        );
      }

      const projectTasks = (projectTaskRows ?? []).map((task) => ({
        ...task,
        task_status: task.status ? taskStatusMap.get(task.status) ?? null : null,
      })) as ProjectTaskSummary[];
      const relatedImages = [
        ...((projectImagesData ?? []).filter(
          (image): image is ProjectImageRelation => Boolean(image?.public_url),
        )),
      ]
        .map((image, index) => ({
          id: image.id,
          url: image.public_url ?? "",
          alt: image.alt ?? projectRecord.title,
          is_main: image.is_main ?? index === 0,
          order: image.order_index ?? index,
          file_path: image.file_path ?? null,
        }))
        .sort((left, right) => left.order - right.order);
      const normalizedImages = relatedImages.length > 0 ? relatedImages : [];
      const editorProject = {
        ...projectRecord,
        images: normalizedImages,
        cover_url:
          normalizedImages.find((image) => image.is_main)?.url ??
          normalizedImages[0]?.url ??
          project.cover_url ??
          null,
        project_status: (projectStatusRow as ProjectStatusSummary | null) ?? null,
        client: (clientRow as ClientSummary | null) ?? null,
        project_files: projectFiles,
        project_services: projectServices,
        project_tasks: projectTasks,
      };

      onEdit(mapProjectWithTools(editorProject, projectTools));
    } catch (error) {
      console.error("Failed to load full project payload for editing", error);
      onEdit(project);
      toast.error(getErrorMessage(error, "Opened project with limited data"));
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
                  <TableCell>
                    {project.project_category?.name ? (
                      <Badge
                        variant="outline"
                        className={neutralReferenceBadgeClassName}
                      >
                        {project.project_category.name}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={neutralReferenceBadgeClassName}
                    >
                      {project.project_status?.label || (project.published ? "Published" : "Draft")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatUiDate(project.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActionsMenu
                      onEdit={() => handleEdit(project)}
                      onDelete={() => setDeleteId(project.id)}
                      isEditDisabled={isFetching}
                    />
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
