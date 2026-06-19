import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { deleteProjectImages } from "@/lib/storageUtils";
import { getErrorMessage } from "@/lib/errorUtils";
import { getProjectImages } from "@/lib/projectUtils";
import { STORAGE_BUCKETS } from "@/lib/storageBuckets";
import { toast } from "sonner";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Database, FolderKanban, Link2, ListTodo, Paperclip, Tag, User2, X } from "lucide-react";
import ImageUploader, { ProjectImage } from "./ImageUploader";
import type { EditableProject, ProjectCategory, ProjectStatusSummary } from "@/types/app";

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

export default function ProjectFormModal({
  isOpen,
  onClose,
  project,
}: ProjectFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [originalImages, setOriginalImages] = useState<ProjectImage[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [tools, setTools] = useState<TechnologyOption[]>([]);
  const [statuses, setStatuses] = useState<ProjectStatusSummary[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const queryClient = useQueryClient();

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
      }
    }
  }, [form, isOpen, project]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("project_category")
      .select("*")
      .order("order_index");
    if (data) setCategories(data as ProjectCategory[]);
  };

  const fetchTools = async () => {
    const { data } = await supabase
      .from("technologies")
      .select("id, name")
      .order("name");
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
    const { data } = await untypedSupabase
      .from("clients")
      .select("id, name, company")
      .order("name");
    if (data) setClients(data as ClientOption[]);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const uploadImages = async (projectId: string, nextImages: ProjectImage[]): Promise<ProjectImage[]> => {
    const uploadedImages: ProjectImage[] = [];

    for (let i = 0; i < nextImages.length; i++) {
      const image = nextImages[i];

      if (image.file) {
        const fileExt = image.file.name.split(".").pop();
        const fileName = `${projectId}/image-${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKETS.projectImages)
          .upload(fileName, image.file, { 
            upsert: true,
            contentType: image.file.type,
          });

        if (uploadError) throw uploadError;

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

      if (deleteRemovedImagesError) {
        throw deleteRemovedImagesError;
      }
    }

    const { error: clearCoverImageError } = await untypedSupabase
      .from("projects")
      .update({ cover_image_id: null })
      .eq("id", projectId);

    if (clearCoverImageError) {
      throw clearCoverImageError;
    }

    const { error: deleteImageRowsError } = await untypedSupabase
      .from("project_images")
      .delete()
      .eq("project_id", projectId);

    if (deleteImageRowsError) {
      throw deleteImageRowsError;
    }

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

    if (insertImagesError) {
      throw insertImagesError;
    }

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

    if (updateCoverImageError) {
      throw updateCoverImageError;
    }

    return mainImageId;
  };

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    const validatedImages = [...images];
    if (!validatedImages.some((img) => img.is_main)) {
      validatedImages[0].is_main = true;
      setImages(validatedImages);
      toast.info("First image set as main");
    }

    setIsLoading(true);
    try {
      let projectId = project?.id;
      const normalizedOrderIndex = values.orderIndex.trim() ? Number(values.orderIndex) : null;
      const normalizedImages = [...validatedImages].map((image, index) => ({
        ...image,
        order: index,
      }));

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

      const { error: updateError } = await untypedSupabase
        .from("projects")
        .update(updateData)
        .eq("id", projectId);

      if (updateError) throw updateError;

      await syncProjectImages(projectId, uploadedImages);

      const { error: deleteProjectTechnologiesError } = await supabase
        .from("project_technologies")
        .delete()
        .eq("project_id", projectId);

      if (deleteProjectTechnologiesError) {
        throw deleteProjectTechnologiesError;
      }

      if (values.technologies && values.technologies.length > 0) {
        const technologyRows = values.technologies.map((technologyId) => ({
          project_id: projectId,
          technology_id: technologyId,
        }));

        const { error: insertProjectTechnologiesError } = await supabase
          .from("project_technologies")
          .insert(technologyRows as never);

        if (insertProjectTechnologiesError) {
          throw insertProjectTechnologiesError;
        }
      }

      toast.success(project ? "Project updated!" : "Project created!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", values.slug] });
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save project"));
    } finally {
      setIsLoading(false);
    }
  };

  const showOnHome = form.watch("showOnHome");
  const projectStatusLabel =
    project?.project_status?.label ||
    statuses.find((status) => status.id === project?.status)?.label ||
    "Not set";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl border bg-card/95 sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create Project"}</DialogTitle>
          <DialogDescription>
            Keep this project polished for both the portfolio grid and the featured sections on the landing page.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-1">
            {project ? (
              <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
                <Card className="admin-surface">
                  <CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Project ID</p>
                      <p className="truncate text-sm font-medium">{project.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">{project.created_at ? new Date(project.created_at).toLocaleString() : "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Updated</p>
                      <p className="text-sm font-medium">{project.updated_at ? new Date(project.updated_at).toLocaleString() : "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                      <p className="text-sm font-medium">{projectStatusLabel}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Client</p>
                      <p className="text-sm font-medium">{project.client?.name || project.client?.company || "Unassigned"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Cover Image ID</p>
                      <p className="truncate text-sm font-medium">{project.cover_image_id || "Not linked"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="admin-surface">
                  <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/70 bg-background/35 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Technologies</p>
                      <p className="mt-2 text-2xl font-semibold">{project.project_technologies.length}</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-background/35 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Related Services</p>
                      <p className="mt-2 text-2xl font-semibold">{project.project_services.length}</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-background/35 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Files</p>
                      <p className="mt-2 text-2xl font-semibold">{project.project_files.length}</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-background/35 p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Tasks</p>
                      <p className="mt-2 text-2xl font-semibold">{project.project_tasks.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            <ImageUploader images={images} onChange={setImages} />

            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Project Title"
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
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="project-slug" {...field} />
                      </FormControl>
                      <FormDescription>URL-friendly identifier</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                    <FormItem>
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

                <FormField
                  control={form.control}
                  name="orderIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Index</FormLabel>
                      <FormControl>
                        <Input inputMode="numeric" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Controls manual ordering in admin and portfolio flows.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description" rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="demoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <FormLabel>Published</FormLabel>
                      <FormDescription className="text-sm">
                        Visible in portfolio page
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showOnHome"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <FormLabel>Show on Home</FormLabel>
                      <FormDescription className="text-sm">
                        Featured on landing page
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {showOnHome && (
                <FormField
                  control={form.control}
                  name="keyMetric"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Metric</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., '40% increase in conversions'"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Highlight a key achievement (shown on home page)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tools / Technologies Used</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {/* Selected tools as badges */}
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-background">
                          {field.value && field.value.length > 0 ? (
                            field.value.map((toolId) => {
                              const tool = tools.find(t => t.id === toolId);
                              return tool ? (
                                <Badge key={toolId} variant="secondary" className="gap-1">
                                  {tool.name}
                                  <X 
                                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                    onClick={() => {
                                      field.onChange(field.value?.filter(id => id !== toolId));
                                    }} 
                                  />
                                </Badge>
                              ) : null;
                            })
                          ) : (
                            <span className="text-sm text-muted-foreground">No tools selected</span>
                          )}
                        </div>
                        {/* Dropdown to add more */}
                        <Select 
                          onValueChange={(value) => {
                            if (!field.value?.includes(value)) {
                              field.onChange([...(field.value || []), value]);
                            }
                          }}
                          value=""
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Add tool..." />
                          </SelectTrigger>
                          <SelectContent>
                            {tools
                              .filter(tool => !field.value?.includes(tool.id))
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
                      Select tools and technologies used in this project
                    </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              />

              {project ? (
                <>
                  <Separator className="my-2" />

                  <div className="grid gap-4 xl:grid-cols-2">
                    <Card className="admin-surface">
                      <CardContent className="space-y-4 p-4">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-semibold">Related Services</h3>
                        </div>
                        {project.project_services.length > 0 ? (
                          <div className="space-y-3">
                            {project.project_services.map((service) => (
                              <div key={service.id} className="rounded-xl border border-border/70 bg-background/35 p-3">
                                <p className="font-medium">{service.title}</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {service.description || "No description"}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No related services linked to this project.</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="admin-surface">
                      <CardContent className="space-y-4 p-4">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-semibold">Project Files</h3>
                        </div>
                        {project.project_files.length > 0 ? (
                          <div className="space-y-3">
                            {project.project_files.map((file) => (
                              <div key={file.id} className="rounded-xl border border-border/70 bg-background/35 p-3">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate font-medium">{file.file_type || "File"}</p>
                                    <p className="truncate text-sm text-muted-foreground">{file.file_url}</p>
                                  </div>
                                  <a
                                    href={file.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                  >
                                    <Link2 className="h-3.5 w-3.5" />
                                    Open
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No project files attached yet.</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="admin-surface">
                      <CardContent className="space-y-4 p-4">
                        <div className="flex items-center gap-2">
                          <ListTodo className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-semibold">Project Tasks</h3>
                        </div>
                        {project.project_tasks.length > 0 ? (
                          <div className="space-y-3">
                            {project.project_tasks.map((task) => (
                              <div key={task.id} className="rounded-xl border border-border/70 bg-background/35 p-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-medium">{task.title}</p>
                                  {task.task_status?.label ? (
                                    <Badge variant="outline">{task.task_status.label}</Badge>
                                  ) : null}
                                </div>
                                {task.description ? (
                                  <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                                ) : null}
                                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                  <span>Due: {task.due_date || "—"}</span>
                                  <span>Created: {task.created_at ? new Date(task.created_at).toLocaleDateString() : "—"}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No project tasks recorded.</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="admin-surface">
                      <CardContent className="space-y-4 p-4">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-semibold">Record Metadata</h3>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start gap-2">
                            <Database className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Internal links</p>
                              <p className="text-muted-foreground">Status ID: {project.status || "—"}</p>
                              <p className="text-muted-foreground">Category ID: {project.category_id || "—"}</p>
                              <p className="text-muted-foreground">Client ID: {project.client_id || "—"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <User2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Client snapshot</p>
                              <p className="text-muted-foreground">{project.client?.name || project.client?.company || "No linked client"}</p>
                              <p className="text-muted-foreground">{project.client?.email || "No client email"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Timestamps</p>
                              <p className="text-muted-foreground">Created: {project.created_at ? new Date(project.created_at).toLocaleString() : "—"}</p>
                              <p className="text-muted-foreground">Updated: {project.updated_at ? new Date(project.updated_at).toLocaleString() : "—"}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border/70 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? "Saving..." : project ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
