import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Database,
  Eye,
  FolderKanban,
  Image as ImageIcon,
  Link2,
  ListTodo,
  Orbit,
  Paperclip,
  Rocket,
  Tag,
  Trash2,
  Upload,
  User2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { deleteProjectFileByUrl, uploadProjectFile } from "@/lib/projectFileStorageUtils";
import { deleteAllProjectImages, deleteProjectImages } from "@/lib/storageUtils";
import { formatUiDate, formatUiDateTime } from "@/lib/date";
import { getErrorMessage } from "@/lib/errorUtils";
import { getProjectImages } from "@/lib/projectUtils";
import { STORAGE_BUCKETS } from "@/lib/storageBuckets";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader, { ProjectImage } from "./ImageUploader";
import type {
  EditableProject,
  ProjectCategory,
  ProjectFileSummary,
  ProjectStatusSummary,
} from "@/types/app";

const untypedSupabase = supabase as unknown as {
  from: (relation: string) => any;
};

interface TechnologyOption {
  id: string;
  name: string;
}

interface ClientOption {
  id: string;
  name: string | null;
  company: string | null;
}

type SectionId = "overview" | "media" | "files" | "organization" | "publishing" | "relations" | "record";

interface SectionDefinition {
  value: SectionId;
  label: string;
  icon: typeof Rocket;
  editOnly?: boolean;
}

const sectionDefinitions: SectionDefinition[] = [
  { value: "overview", label: "Overview", icon: Rocket },
  { value: "media", label: "Media", icon: ImageIcon },
  { value: "files", label: "Files", icon: Paperclip, editOnly: true },
  { value: "organization", label: "Organization", icon: Orbit },
  { value: "publishing", label: "Publishing", icon: Eye },
  { value: "relations", label: "Relations", icon: FolderKanban, editOnly: true },
  { value: "record", label: "Record", icon: Database, editOnly: true },
];

interface EditableProjectFile {
  id?: string;
  file_url: string;
  file_type: string | null;
  order_index: number;
  created_at?: string | null;
  file_name?: string | null;
}

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  categoryId: z.string().optional(),
  shortDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters"),
  fullDescription: z.string().max(2000).optional(),
  demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
  showOnHome: z.boolean(),
  keyMetric: z.string().max(100).optional(),
  orderIndex: z.string().refine((value) => value === "" || /^\d+$/.test(value), "Order must be 0 or greater"),
  statusId: z.string().optional(),
  clientId: z.string().optional(),
  technologies: z.array(z.string()).optional(),
});

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: EditableProject | null;
}

function SectionCard({
  title,
  description,
  children,
  aside,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <Card className="admin-surface border-border/80">
      <CardHeader className="flex flex-col gap-4 border-b border-border/70 pb-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </CardHeader>
      <CardContent className="space-y-6 p-6">{children}</CardContent>
    </Card>
  );
}

function ToggleFieldShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-[18px] border border-border/70 bg-background/35 px-5 py-4">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-border/70 bg-background/35 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function EmptyRelationState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof FolderKanban;
}) {
  return (
    <div className="rounded-[18px] border border-dashed border-border/70 bg-background/25 p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl border border-border/70 bg-muted/40 p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  project,
}: ProjectFormModalProps) {
  const mode = project ? "edit" : "create";
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [originalImages, setOriginalImages] = useState<ProjectImage[]>([]);
  const [projectFiles, setProjectFiles] = useState<EditableProjectFile[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [tools, setTools] = useState<TechnologyOption[]>([]);
  const [statuses, setStatuses] = useState<ProjectStatusSummary[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const queryClient = useQueryClient();
  const projectFileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      categoryId: project?.category_id || "",
      shortDescription: project?.short_description || "",
      fullDescription: project?.full_description || "",
      demoUrl: project?.demo_url || "",
      githubUrl: project?.github_url || "",
      published: project?.published || false,
      showOnHome: project?.show_on_home || false,
      keyMetric: project?.key_metric || "",
      orderIndex: project?.order_index?.toString() || "",
      statusId: project?.status || "",
      clientId: project?.client_id || "",
      technologies: project?.project_tools.map((tool) => tool.id) || [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      setActiveSection("overview");
      fetchCategories();
      fetchTools();
      fetchStatuses();
      fetchClients();

      if (project) {
        form.reset({
          title: project.title || "",
          slug: project.slug || "",
          categoryId: project.category_id || "",
          shortDescription: project.short_description || "",
          fullDescription: project.full_description || "",
          demoUrl: project.demo_url || "",
          githubUrl: project.github_url || "",
          published: project.published || false,
          showOnHome: project.show_on_home || false,
          keyMetric: project.key_metric || "",
          orderIndex: project.order_index?.toString() || "",
          statusId: project.status || "",
          clientId: project.client_id || "",
          technologies: project.project_tools.map((tool) => tool.id) || [],
        });

        const projectImages = getProjectImages(project.images, {
          coverUrl: project.cover_url,
          title: project.title,
        });

        setImages(projectImages);
        setOriginalImages(projectImages);
        setProjectFiles(
          [...(project.project_files ?? [])]
            .sort((left, right) => (left.order_index ?? 0) - (right.order_index ?? 0))
            .map((file, index) => ({
              id: file.id,
              file_url: file.file_url,
              file_type: file.file_type,
              order_index: file.order_index ?? index,
              created_at: file.created_at,
              file_name: file.file_url.split("/").pop() ?? file.file_type ?? "File",
            })),
        );
      } else {
        form.reset({
          title: "",
          slug: "",
          categoryId: "",
          shortDescription: "",
          fullDescription: "",
          demoUrl: "",
          githubUrl: "",
          published: false,
          showOnHome: false,
          keyMetric: "",
          orderIndex: "",
          statusId: "",
          clientId: "",
          technologies: [],
        });
        setImages([]);
        setOriginalImages([]);
        setProjectFiles([]);
      }
    }
  }, [form, isOpen, project]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("project_category").select("*").order("order_index");
    if (data) setCategories(data as ProjectCategory[]);
  };

  const fetchTools = async () => {
    const { data } = await supabase.from("technologies").select("id, name").order("name");
    if (data) setTools(data as TechnologyOption[]);
  };

  const fetchStatuses = async () => {
    const { data } = await untypedSupabase
      .from("project_status")
      .select("id, label, color, order_index")
      .order("order_index");
    if (data) setStatuses(data as ProjectStatusSummary[]);
  };

  const fetchClients = async () => {
    const { data } = await untypedSupabase.from("clients").select("id, name, company").order("name");
    if (data) setClients(data as ClientOption[]);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const ensureUniqueProjectSlug = async (slug: string, currentProjectId?: string) => {
    const { data, error } = await untypedSupabase
      .from("projects")
      .select("id, title, slug")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data && data.id !== currentProjectId) {
      throw new Error(`Project slug "${slug}" is already in use. Please choose a different slug.`);
    }
  };

  const uploadImages = async (projectId: string, nextImages: ProjectImage[]): Promise<ProjectImage[]> => {
    const uploadedImages: ProjectImage[] = [];
    const uploadedFilePaths: string[] = [];

    try {
      for (let i = 0; i < nextImages.length; i++) {
        const image = nextImages[i];

        if (image.file) {
          const fileExt = image.file.name.split(".").pop();
          const fileName = `${projectId}/image-${Date.now()}-${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKETS.projectImages)
            .upload(fileName, image.file, {
              contentType: image.file.type,
            });

          if (uploadError) throw uploadError;

          uploadedFilePaths.push(fileName);

          const {
            data: { publicUrl },
          } = supabase.storage.from(STORAGE_BUCKETS.projectImages).getPublicUrl(fileName);

          uploadedImages.push({
            id: image.id,
            url: publicUrl,
            alt: image.alt,
            is_main: image.is_main,
            order: i,
            file_path: fileName,
          });
        } else {
          uploadedImages.push({
            id: image.id,
            url: image.url,
            alt: image.alt,
            is_main: image.is_main,
            order: i,
            file_path: image.file_path ?? null,
          });
        }
      }

      return uploadedImages;
    } catch (error) {
      if (uploadedFilePaths.length > 0) {
        await supabase.storage.from(STORAGE_BUCKETS.projectImages).remove(uploadedFilePaths);
      }

      throw error;
    }
  };

  const syncProjectImages = async (projectId: string, nextImages: ProjectImage[]) => {
    const removedImageUrls = originalImages
      .filter((originalImage) => !nextImages.some((image) => image.url === originalImage.url))
      .map((image) => image.url);

    const removedImageIds = originalImages
      .filter((originalImage) => !nextImages.some((image) => image.url === originalImage.url))
      .map((image) => image.id)
      .filter((imageId): imageId is string => Boolean(imageId));

    if (removedImageUrls.length > 0) {
      await deleteProjectImages(projectId, removedImageUrls);
    }

    if (removedImageIds.length > 0) {
      const { error: deleteRemovedImagesError } = await untypedSupabase
        .from("project_images")
        .delete()
        .in("id", removedImageIds);

      if (deleteRemovedImagesError) throw deleteRemovedImagesError;
    }

    const { error: clearCoverImageError } = await untypedSupabase
      .from("projects")
      .update({ cover_image_id: null })
      .eq("id", projectId);

    if (clearCoverImageError) throw clearCoverImageError;

    const { error: deleteImageRowsError } = await untypedSupabase
      .from("project_images")
      .delete()
      .eq("project_id", projectId);

    if (deleteImageRowsError) throw deleteImageRowsError;

    if (nextImages.length === 0) {
      return null;
    }

    const imageRows = nextImages.map((image, index) => ({
      project_id: projectId,
      file_path: image.file_path ?? null,
      public_url: image.url,
      alt: image.alt,
      order_index: index,
      is_main: image.is_main,
    }));

    const { data: insertedImages, error: insertImagesError } = await untypedSupabase
      .from("project_images")
      .insert(imageRows)
      .select("id, is_main, order_index")
      .order("order_index", { ascending: true });

    if (insertImagesError) throw insertImagesError;

    const mainImageId =
      ((insertedImages ?? []) as Array<{ id: string; is_main: boolean | null; order_index: number | null }>).find(
        (image) => image.is_main,
      )?.id ??
      ((insertedImages ?? []) as Array<{ id: string }>)[0]?.id ??
      null;

    const { error: updateCoverImageError } = await untypedSupabase
      .from("projects")
      .update({ cover_image_id: mainImageId })
      .eq("id", projectId);

    if (updateCoverImageError) throw updateCoverImageError;

    return mainImageId;
  };

  const syncProjectFiles = async (projectId: string, nextFiles: EditableProjectFile[]) => {
    const { error: deleteProjectFilesError } = await untypedSupabase
      .from("project_files")
      .delete()
      .eq("project_id", projectId);

    if (deleteProjectFilesError) throw deleteProjectFilesError;

    if (nextFiles.length === 0) {
      return;
    }

    const fileRows = nextFiles.map((file, index) => ({
      project_id: projectId,
      file_url: file.file_url.trim(),
      file_type: file.file_type?.trim() || null,
      order_index: index,
    }));

    const { error: insertProjectFilesError } = await untypedSupabase
      .from("project_files")
      .insert(fileRows);

    if (insertProjectFilesError) throw insertProjectFilesError;
  };

  const deriveProjectFileType = (file: File): string => {
    if (file.type) {
      return file.type;
    }

    const extension = file.name.split(".").pop();
    return extension ? extension.toUpperCase() : "File";
  };

  const handleProjectFileUpload = async (selectedFiles: FileList | null) => {
    if (!project?.id || !selectedFiles || selectedFiles.length === 0) {
      return;
    }

    setIsUploadingFiles(true);

    try {
      const currentMaxOrder = projectFiles.length;
      const uploadedFiles: EditableProjectFile[] = [];

      for (let index = 0; index < selectedFiles.length; index += 1) {
        const selectedFile = selectedFiles[index];
        const { publicUrl } = await uploadProjectFile(project.id, selectedFile);

        const insertPayload = {
          project_id: project.id,
          file_url: publicUrl,
          file_type: deriveProjectFileType(selectedFile),
          order_index: currentMaxOrder + index,
        };

        const { data: insertedFile, error: insertError } = await untypedSupabase
          .from("project_files")
          .insert(insertPayload)
          .select("id, file_url, file_type, order_index, created_at")
          .single();

        if (insertError) {
          await deleteProjectFileByUrl(publicUrl);
          throw insertError;
        }

        uploadedFiles.push({
          ...(insertedFile as ProjectFileSummary),
          file_name: selectedFile.name,
        });
      }

      setProjectFiles((currentFiles) => [...currentFiles, ...uploadedFiles]);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      if (project.slug) {
        queryClient.invalidateQueries({ queryKey: ["project", project.slug] });
      }
      toast.success(
        uploadedFiles.length === 1
          ? "Project file uploaded."
          : `${uploadedFiles.length} project files uploaded.`,
      );
    } catch (error) {
      const fallbackMessage = getErrorMessage(error, "Failed to upload project file");
      const message = fallbackMessage.toLowerCase().includes("row-level security policy")
        ? "Project file upload is blocked by Supabase RLS. Apply the new project_files bucket and table policies, then try again."
        : fallbackMessage;
      toast.error(message);
    } finally {
      if (projectFileInputRef.current) {
        projectFileInputRef.current.value = "";
      }
      setIsUploadingFiles(false);
    }
  };

  const updateProjectFileRow = (
    index: number,
    updates: Partial<EditableProjectFile>,
  ) => {
    setProjectFiles((currentFiles) =>
      currentFiles.map((currentFile, currentIndex) =>
        currentIndex === index ? { ...currentFile, ...updates } : currentFile,
      ),
    );
  };

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    const validatedImages = [...images];
    const validatedProjectFiles = projectFiles
      .map((file, index) => ({
        ...file,
        file_url: file.file_url.trim(),
        file_type: file.file_type?.trim() || null,
        order_index: index,
      }))
      .filter((file) => file.file_url.length > 0);

    const hasIncompleteFile = projectFiles.some((file) => file.file_url.trim().length === 0);
    if (hasIncompleteFile) {
      toast.error("Please add a valid file URL or remove the empty file row.");
      setActiveSection("files");
      return;
    }

    if (!validatedImages.some((img) => img.is_main)) {
      validatedImages[0].is_main = true;
      setImages(validatedImages);
      toast.info("First image set as main");
    }

    setIsLoading(true);
    let createdProjectId: string | undefined;
    try {
      let projectId = project?.id;
      const normalizedOrderIndex = values.orderIndex.trim() ? Number(values.orderIndex) : null;
      const normalizedImages = [...validatedImages].map((image, index) => ({
        ...image,
        order: index,
      }));

      await ensureUniqueProjectSlug(values.slug, projectId);

      if (!projectId) {
        const insertData = {
          title: values.title,
          slug: values.slug,
          short_description: values.shortDescription,
        } satisfies Partial<TablesInsert<"projects">>;

        const { data: newProject, error: insertError } = await supabase
          .from("projects")
          .insert(insertData)
          .select()
          .single();

        if (insertError) throw insertError;
        projectId = newProject.id;
        createdProjectId = newProject.id;
      }

      const uploadedImages = await uploadImages(projectId, normalizedImages);

      const updateData: Record<string, unknown> = {
        title: values.title,
        slug: values.slug,
        short_description: values.shortDescription,
        full_description: values.fullDescription || null,
        category_id: values.categoryId || null,
        client_id: values.clientId || null,
        status: values.statusId || null,
        order_index: normalizedOrderIndex,
        demo_url: values.demoUrl || null,
        github_url: values.githubUrl || null,
        published: values.published,
        show_on_home: values.showOnHome,
        key_metric: values.keyMetric || null,
      };

      const { error: updateError } = await untypedSupabase.from("projects").update(updateData).eq("id", projectId);
      if (updateError) throw updateError;

      await syncProjectImages(projectId, uploadedImages);
      await syncProjectFiles(projectId, validatedProjectFiles);

      const { error: deleteProjectTechnologiesError } = await supabase
        .from("project_technologies")
        .delete()
        .eq("project_id", projectId);

      if (deleteProjectTechnologiesError) throw deleteProjectTechnologiesError;

      if (values.technologies && values.technologies.length > 0) {
        const technologyRows = values.technologies.map((technologyId) => ({
          project_id: projectId,
          technology_id: technologyId,
        }));

        const { error: insertProjectTechnologiesError } = await supabase
          .from("project_technologies")
          .insert(technologyRows as never);

        if (insertProjectTechnologiesError) throw insertProjectTechnologiesError;
      }

      toast.success(project ? "Project updated!" : "Project created!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", values.slug] });
      onClose();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Project slug "')) {
        form.setError("slug", { type: "manual", message: error.message });
      }

      if (createdProjectId) {
        try {
          await deleteAllProjectImages(createdProjectId);
          await supabase.from("projects").delete().eq("id", createdProjectId);
        } catch (cleanupError) {
          console.error("Failed to rollback partially created project", cleanupError);
        }
      }

      toast.error(getErrorMessage(error, "Failed to save project"));
    } finally {
      setIsLoading(false);
    }
  };

  const showOnHome = form.watch("showOnHome");
  const selectedTechnologies = form.watch("technologies") || [];
  const projectStatusLabel =
    project?.project_status?.label ||
    statuses.find((status) => status.id === project?.status)?.label ||
    "Not set";
  const availableSections = sectionDefinitions.filter((section) => !section.editOnly || mode === "edit");
  const visibleSection = availableSections.some((section) => section.value === activeSection)
    ? activeSection
    : availableSections[0].value;
  const relationSummary = [
    { label: "Services", value: project?.project_services.length ?? 0 },
    { label: "Files", value: projectFiles.length },
    { label: "Tasks", value: project?.project_tasks.length ?? 0 },
    { label: "Tech", value: project?.project_technologies.length ?? 0 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="admin-modal-shell !max-w-6xl gap-0 overflow-hidden !p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-h-[92vh] flex-col">
            <div className="border-b border-border/70 bg-card/95 px-6 pb-5 pt-6 backdrop-blur-xl">
              <DialogHeader className="space-y-4 pr-10 text-left">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="rounded-[5px] border-border/80 bg-background/50 px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
                        {mode === "edit" ? "Edit Project" : "Create Project"}
                      </Badge>
                      <Badge
                        variant={form.watch("published") ? "default" : "secondary"}
                        className="rounded-[5px] px-3 py-1 text-[11px] uppercase tracking-[0.16em]"
                      >
                        {form.watch("published") ? "Published" : "Draft"}
                      </Badge>
                      {mode === "edit" && project?.updated_at ? (
                        <span className="text-xs text-muted-foreground">
                          Updated {formatUiDateTime(project.updated_at)}
                        </span>
                      ) : null}
                    </div>
                    <DialogTitle className="text-3xl font-semibold tracking-tight">
                      {mode === "edit" ? "Edit Project" : "Create Project"}
                    </DialogTitle>
                    <DialogDescription className="max-w-3xl text-sm leading-6">
                      {mode === "edit"
                        ? "Refine the project across overview, media, publishing, and internal relations without leaving the admin workflow."
                        : "Build a clean project record with consistent media, metadata, and publishing controls for the portfolio and home page."}
                    </DialogDescription>
                  </div>

                  {mode === "edit" && project ? (
                    <div className="grid min-w-[280px] gap-3 sm:grid-cols-2">
                      <InfoTile label="Status" value={projectStatusLabel} />
                      <InfoTile
                        label="Client"
                        value={project.client?.name || project.client?.company || "Unassigned"}
                      />
                    </div>
                  ) : null}
                </div>
              </DialogHeader>
            </div>

            <Tabs value={visibleSection} onValueChange={(value) => setActiveSection(value as SectionId)} className="flex min-h-0 flex-1 flex-col">
              <div className="border-b border-border/70 bg-card/92 px-6 py-3 backdrop-blur-xl">
                <div className="overflow-x-auto scrollbar-hide">
                  <TabsList className="inline-flex h-auto min-w-max gap-2 rounded-[18px] border border-border/70 bg-background/40 p-1">
                    {availableSections.map((section) => {
                      const Icon = section.icon;
                      const badgeValue =
                        section.value === "media"
                          ? images.length
                          : section.value === "relations" && mode === "edit"
                            ? relationSummary.reduce((sum, item) => sum + item.value, 0)
                            : undefined;

                      return (
                        <TabsTrigger
                          key={section.value}
                          value={section.value}
                          className="gap-2 rounded-[14px] px-4 py-2.5 text-sm data-[state=active]:border data-[state=active]:border-border/80 data-[state=active]:bg-card"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{section.label}</span>
                          {typeof badgeValue === "number" ? (
                            <span className="rounded-full bg-background/70 px-2 py-0.5 text-[11px] text-muted-foreground">
                              {badgeValue}
                            </span>
                          ) : null}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>
              </div>

              <ScrollArea className="min-h-0 flex-1">
                <div className="px-6 py-6">
                  <TabsContent value="overview" className="mt-0">
                    <SectionCard
                      title="Overview"
                      description="Define the project identity, public copy, and destination links in one clean section."
                      aside={
                        <Badge variant="outline" className="rounded-[5px] border-border/70 bg-background/50 px-3 py-1 text-xs">
                          Core info
                        </Badge>
                      }
                    >
                      <div className="grid gap-4 lg:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Title *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Project title"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (!project) {
                                      form.setValue("slug", generateSlug(e.target.value));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Slug *</FormLabel>
                              <FormControl>
                                <Input placeholder="project-slug" {...field} />
                              </FormControl>
                              <FormDescription>Used in the portfolio URL and internal lookup.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Short Description *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="A concise summary for cards and list views" rows={3} {...field} />
                            </FormControl>
                            <FormDescription>Keep this tight and scannable for portfolio previews.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fullDescription"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Full Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="A longer narrative for the project detail page" rows={7} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 lg:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="demoUrl"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Demo URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://demo.example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="githubUrl"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>GitHub URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/org/repo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </SectionCard>
                  </TabsContent>

                  <TabsContent value="media" className="mt-0">
                    <SectionCard
                      title="Media"
                      description="Upload, order, and annotate the project gallery. The first main image becomes the cover source."
                      aside={
                        <div className="grid gap-2 sm:grid-cols-2">
                          <InfoTile label="Images" value={images.length} />
                          <InfoTile
                            label="Main"
                            value={images.find((image) => image.is_main)?.alt || "Not set"}
                          />
                        </div>
                      }
                    >
                      <div className="rounded-[18px] border border-dashed border-border/70 bg-background/20 p-4">
                        <ImageUploader images={images} onChange={setImages} />
                      </div>
                    </SectionCard>
                  </TabsContent>

                  {mode === "edit" ? (
                    <TabsContent value="files" className="mt-0">
                      <SectionCard
                        title="Files"
                        description="Upload project files into Supabase Storage and keep their linked project records in sync."
                        aside={
                          <div className="grid gap-2 sm:grid-cols-2">
                            <InfoTile label="Files" value={projectFiles.length} />
                            <div>
                              <input
                                ref={projectFileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(event) => {
                                  void handleProjectFileUpload(event.target.files);
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="h-auto rounded-[18px] border-border/70 bg-background/50 px-4 py-3"
                                onClick={() => projectFileInputRef.current?.click()}
                                disabled={isUploadingFiles}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                {isUploadingFiles ? "Uploading..." : "Upload Files"}
                              </Button>
                            </div>
                          </div>
                        }
                      >
                        {projectFiles.length > 0 ? (
                          <div className="space-y-4">
                            {projectFiles.map((file, index) => (
                              <div
                                key={file.id ?? `new-file-${index}`}
                                className="rounded-[18px] border border-border/70 bg-background/25 p-4"
                              >
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                                  <div className="grid flex-1 gap-4 md:grid-cols-2">
                                    <FormItem className="space-y-3">
                                      <FormLabel>File URL</FormLabel>
                                      <FormControl>
                                        <Input
                                          value={file.file_url}
                                          placeholder="Storage URL"
                                          onChange={(event) => {
                                            updateProjectFileRow(index, { file_url: event.target.value });
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>

                                    <FormItem className="space-y-3">
                                      <FormLabel>File Type</FormLabel>
                                      <FormControl>
                                        <Input
                                          value={file.file_type ?? ""}
                                          placeholder="PDF, Figma, Loom, ZIP"
                                          onChange={(event) => {
                                            updateProjectFileRow(index, { file_type: event.target.value });
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  </div>

                                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="rounded-xl"
                                      onClick={() => {
                                        if (index === 0) return;
                                        setProjectFiles((currentFiles) => {
                                          const nextFiles = [...currentFiles];
                                          [nextFiles[index - 1], nextFiles[index]] = [nextFiles[index], nextFiles[index - 1]];
                                          return nextFiles.map((currentFile, currentIndex) => ({
                                            ...currentFile,
                                            order_index: currentIndex,
                                          }));
                                        });
                                      }}
                                      disabled={index === 0}
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="rounded-xl"
                                      onClick={() => {
                                        if (index === projectFiles.length - 1) return;
                                        setProjectFiles((currentFiles) => {
                                          const nextFiles = [...currentFiles];
                                          [nextFiles[index], nextFiles[index + 1]] = [nextFiles[index + 1], nextFiles[index]];
                                          return nextFiles.map((currentFile, currentIndex) => ({
                                            ...currentFile,
                                            order_index: currentIndex,
                                          }));
                                        });
                                      }}
                                      disabled={index === projectFiles.length - 1}
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    {file.file_url ? (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="rounded-xl"
                                        asChild
                                      >
                                        <a href={file.file_url} target="_blank" rel="noreferrer">
                                          <Link2 className="mr-2 h-4 w-4" />
                                          Open
                                        </a>
                                      </Button>
                                    ) : null}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="rounded-xl text-destructive hover:text-destructive"
                                      onClick={() => {
                                        void (async () => {
                                          try {
                                            if (file.id) {
                                              const { error: deleteRowError } = await untypedSupabase
                                                .from("project_files")
                                                .delete()
                                                .eq("id", file.id);

                                              if (deleteRowError) throw deleteRowError;
                                            }

                                            await deleteProjectFileByUrl(file.file_url);

                                            setProjectFiles((currentFiles) =>
                                              currentFiles
                                                .filter((_, currentIndex) => currentIndex !== index)
                                                .map((currentFile, currentIndex) => ({
                                                  ...currentFile,
                                                  order_index: currentIndex,
                                                })),
                                            );
                                            queryClient.invalidateQueries({ queryKey: ["projects"] });
                                            if (project.slug) {
                                              queryClient.invalidateQueries({ queryKey: ["project", project.slug] });
                                            }
                                            toast.success("Project file removed.");
                                          } catch (error) {
                                            toast.error(getErrorMessage(error, "Failed to remove project file"));
                                          }
                                        })();
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                  <span>Order: {index + 1}</span>
                                  {file.file_name ? <span>Name: {file.file_name}</span> : null}
                                  <span>Saved type: {file.file_type || "Not set"}</span>
                                  {file.created_at ? <span>Created: {formatUiDate(file.created_at)}</span> : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <EmptyRelationState
                            title="No project files yet"
                            description="Upload files to the project_files bucket and they will be linked into the project_files table automatically."
                            icon={Paperclip}
                          />
                        )}
                      </SectionCard>
                    </TabsContent>
                  ) : null}

                  <TabsContent value="organization" className="mt-0">
                    <SectionCard
                      title="Organization"
                      description="Connect the project to its taxonomy, ownership, and technology stack."
                      aside={
                        <Badge variant="outline" className="rounded-full border-border/70 bg-background/50 px-3 py-1 text-xs">
                          Internal structure
                        </Badge>
                      }
                    >
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="statusId"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {statuses.map((status) => (
                                    <SelectItem key={status.id} value={status.id}>
                                      {status.label || status.id}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="clientId"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Client</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select client" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {clients.map((client) => (
                                    <SelectItem key={client.id} value={client.id}>
                                      {client.name || client.company || client.id}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="technologies"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Technologies</FormLabel>
                            <FormControl>
                              <div className="space-y-3">
                                <div className="min-h-14 rounded-[18px] border border-input bg-background px-5 py-3">
                                  {field.value && field.value.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {field.value.map((toolId) => {
                                        const tool = tools.find((item) => item.id === toolId);
                                        if (!tool) return null;

                                        return (
                                          <Badge
                                            key={toolId}
                                            variant="secondary"
                                            className="gap-1.5 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs"
                                          >
                                            {tool.name}
                                            <button
                                              type="button"
                                              className="rounded-full p-0.5 text-muted-foreground transition-colors hover:text-destructive"
                                              onClick={() => {
                                                field.onChange(field.value?.filter((id) => id !== toolId));
                                              }}
                                              aria-label={`Remove ${tool.name}`}
                                            >
                                              <X className="h-3 w-3" />
                                            </button>
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p className="text-[15px] text-muted-foreground">No technologies selected yet.</p>
                                  )}
                                </div>

                                <Select
                                  onValueChange={(value) => {
                                    if (!field.value?.includes(value)) {
                                      field.onChange([...(field.value || []), value]);
                                    }
                                  }}
                                  value=""
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Add technology" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {tools
                                      .filter((tool) => !field.value?.includes(tool.id))
                                      .map((tool) => (
                                        <SelectItem key={tool.id} value={tool.id}>
                                          {tool.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Keep the stack focused on what the viewer or admin needs to recognize quickly.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </SectionCard>
                  </TabsContent>

                  <TabsContent value="publishing" className="mt-0">
                    <SectionCard
                      title="Publishing"
                      description="Control portfolio visibility, homepage promotion, and manual ranking from one place."
                      aside={
                        <div className="grid gap-2 sm:grid-cols-2">
                          <InfoTile label="Homepage" value={showOnHome ? "Featured" : "Standard"} />
                          <InfoTile label="Technologies" value={selectedTechnologies.length} />
                        </div>
                      }
                    >
                      <div className="grid gap-4 lg:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="published"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <ToggleFieldShell
                                  title="Published"
                                  description="Makes this project visible on the public portfolio."
                                >
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </ToggleFieldShell>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="showOnHome"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <ToggleFieldShell
                                  title="Show on Home"
                                  description="Highlights the project in the homepage featured section."
                                >
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </ToggleFieldShell>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="orderIndex"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Order Index</FormLabel>
                              <FormControl>
                                <Input inputMode="numeric" placeholder="0" {...field} />
                              </FormControl>
                              <FormDescription>Controls manual ordering across admin and portfolio lists.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {showOnHome ? (
                          <FormField
                            control={form.control}
                            name="keyMetric"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Key Metric</FormLabel>
                                <FormControl>
                                  <Input placeholder="40% increase in conversions" {...field} />
                                </FormControl>
                                <FormDescription>
                                  A concise headline metric for the featured homepage card.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <EmptyRelationState
                            title="Key metric is optional"
                            description="Enable “Show on Home” to add a homepage-facing metric for the featured card."
                            icon={Rocket}
                          />
                        )}
                      </div>
                    </SectionCard>
                  </TabsContent>

                  {mode === "edit" && project ? (
                    <TabsContent value="relations" className="mt-0">
                      <SectionCard
                        title="Relations"
                        description="Review connected services, attached files, and task activity without mixing them into the core editing flow."
                        aside={
                          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                            {relationSummary.map((item) => (
                              <InfoTile key={item.label} label={item.label} value={item.value} />
                            ))}
                          </div>
                        }
                      >
                        <div className="grid gap-4 xl:grid-cols-3">
                          <Card className="rounded-[18px] border-border/70 bg-background/25">
                            <CardHeader className="pb-4">
                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">Related Services</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {project.project_services.length > 0 ? (
                                project.project_services.map((service) => (
                                  <div key={service.id} className="rounded-[16px] border border-border/70 bg-background/40 p-4">
                                    <p className="text-sm font-medium text-foreground">{service.title}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {service.description || "No description"}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <EmptyRelationState
                                  title="No linked services"
                                  description="This project does not currently reference any services."
                                  icon={Tag}
                                />
                              )}
                            </CardContent>
                          </Card>

                          <Card className="rounded-[18px] border-border/70 bg-background/25">
                            <CardHeader className="pb-4">
                              <div className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">Project Files</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {project.project_files.length > 0 ? (
                                project.project_files.map((file) => (
                                  <div key={file.id} className="rounded-[16px] border border-border/70 bg-background/40 p-4">
                                    <p className="truncate text-sm font-medium text-foreground">{file.file_type || "File"}</p>
                                    <p className="mt-1 truncate text-sm text-muted-foreground">{file.file_url}</p>
                                    <a
                                      href={file.file_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                      <Link2 className="h-3.5 w-3.5" />
                                      Open file
                                    </a>
                                  </div>
                                ))
                              ) : (
                                <EmptyRelationState
                                  title="No attached files"
                                  description="Use the Files section to add project-linked file records for delivery assets or references."
                                  icon={Paperclip}
                                />
                              )}
                            </CardContent>
                          </Card>

                          <Card className="rounded-[18px] border-border/70 bg-background/25">
                            <CardHeader className="pb-4">
                              <div className="flex items-center gap-2">
                                <ListTodo className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">Tasks</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {project.project_tasks.length > 0 ? (
                                project.project_tasks.map((task) => (
                                  <div key={task.id} className="rounded-[16px] border border-border/70 bg-background/40 p-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                                      {task.task_status?.label ? <Badge variant="outline" className="rounded-[5px]">{task.task_status.label}</Badge> : null}
                                    </div>
                                    {task.description ? (
                                      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                                    ) : null}
                                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                      <span>Due: {task.due_date || "—"}</span>
                                      <span>
                                        Created: {formatUiDate(task.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <EmptyRelationState
                                  title="No tasks recorded"
                                  description="This project has no linked task activity yet."
                                  icon={ListTodo}
                                />
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </SectionCard>
                    </TabsContent>
                  ) : null}

                  {mode === "edit" && project ? (
                    <TabsContent value="record" className="mt-0">
                      <SectionCard
                        title="Record"
                        description="Reference the underlying record metadata and internal links without crowding the core editing experience."
                        aside={
                          <Badge variant="outline" className="rounded-full border-border/70 bg-background/50 px-3 py-1 text-xs">
                            Read-only metadata
                          </Badge>
                        }
                      >
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <InfoTile label="Project ID" value={<span className="break-all">{project.id}</span>} />
                          <InfoTile
                            label="Created"
                            value={formatUiDateTime(project.created_at)}
                          />
                          <InfoTile
                            label="Updated"
                            value={formatUiDateTime(project.updated_at)}
                          />
                          <InfoTile label="Status" value={projectStatusLabel} />
                          <InfoTile
                            label="Client"
                            value={project.client?.name || project.client?.company || "Unassigned"}
                          />
                          <InfoTile
                            label="Cover Image ID"
                            value={<span className="break-all">{project.cover_image_id || "Not linked"}</span>}
                          />
                        </div>

                        <Separator />

                        <div className="grid gap-4 xl:grid-cols-2">
                          <Card className="rounded-[18px] border-border/70 bg-background/25">
                            <CardHeader className="pb-4">
                              <div className="flex items-center gap-2">
                                <Database className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">Internal Links</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <InfoTile label="Status ID" value={project.status || "—"} />
                              <InfoTile label="Category ID" value={project.category_id || "—"} />
                              <InfoTile label="Client ID" value={project.client_id || "—"} />
                            </CardContent>
                          </Card>

                          <Card className="rounded-[18px] border-border/70 bg-background/25">
                            <CardHeader className="pb-4">
                              <div className="flex items-center gap-2">
                                <User2 className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">Client Snapshot</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <InfoTile
                                label="Name"
                                value={project.client?.name || project.client?.company || "No linked client"}
                              />
                              <InfoTile label="Email" value={project.client?.email || "No client email"} />
                              <InfoTile
                                label="Last Updated"
                                value={formatUiDateTime(project.updated_at)}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </SectionCard>
                    </TabsContent>
                  ) : null}
                </div>
              </ScrollArea>
            </Tabs>

            <div className="border-t border-border/70 bg-card/95 px-6 py-4 backdrop-blur-xl">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Review each section before saving. Required fields and validation stay attached to their own controls.
                </p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                    {isLoading ? "Saving..." : project ? "Update Project" : "Create Project"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
