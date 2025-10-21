import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { deleteProjectImages } from "@/lib/storageUtils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
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
import { X } from "lucide-react";
import ImageUploader, { ProjectImage } from "./ImageUploader";

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
  technologies: z.array(z.string()).optional(),
});

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: any | null;
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  project,
}: ProjectFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
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
      technologies: project?.project_technologies?.map((pt: any) => pt.technologies.id) || [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchTechnologies();

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
          technologies: project.project_technologies?.map((pt: any) => pt.technologies.id) || [],
        });

        const projectImages = project.images && Array.isArray(project.images) && project.images.length > 0
          ? project.images.sort((a: any, b: any) => a.order - b.order)
          : project.cover_url
          ? [{ url: project.cover_url, alt: project.title, is_main: true, order: 0 }]
          : [];

        setImages(projectImages);
        setOriginalImages(projectImages.map((img: any) => img.url));
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
          technologies: [],
        });
        setImages([]);
        setOriginalImages([]);
      }
    }
  }, [isOpen, project]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("project_category")
      .select("*")
      .order("order_index");
    if (data) setCategories(data);
  };

  const fetchTechnologies = async () => {
    const { data } = await supabase
      .from("technologies")
      .select("*")
      .order("name");
    if (data) setTechnologies(data);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const uploadImages = async (projectId: string): Promise<ProjectImage[]> => {
    const uploadedImages: ProjectImage[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (image.file) {
        const fileExt = image.file.name.split(".").pop();
        const fileName = `${projectId}/image-${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(fileName, image.file, { 
            upsert: true,
            contentType: image.file.type,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(fileName);

        uploadedImages.push({
          url: publicUrl,
          alt: image.alt,
          is_main: image.is_main,
          order: i,
        });
      } else {
        uploadedImages.push({
          url: image.url,
          alt: image.alt,
          is_main: image.is_main,
          order: i,
        });
      }
    }

    return uploadedImages;
  };

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    let validatedImages = [...images];
    if (!validatedImages.some((img) => img.is_main)) {
      validatedImages[0].is_main = true;
      setImages(validatedImages);
      toast.info("First image set as main");
    }

    setIsLoading(true);
    try {
      let projectId = project?.id;

      if (!projectId) {
        const insertData: any = { 
          title: values.title, 
          slug: values.slug,
          short_description: values.shortDescription,
        };
        
        const { data: newProject, error: insertError } = await supabase
          .from("projects")
          .insert(insertData)
          .select()
          .single();

        if (insertError) throw insertError;
        projectId = newProject.id;
      }

      const uploadedImages = await uploadImages(projectId);
      const mainImage = uploadedImages.find((img) => img.is_main) || uploadedImages[0];

      const updateData: any = {
        title: values.title,
        slug: values.slug,
        short_description: values.shortDescription,
        full_description: values.fullDescription || null,
        category_id: values.categoryId || null,
        demo_url: values.demoUrl || null,
        github_url: values.githubUrl || null,
        published: values.published,
        show_on_home: values.showOnHome,
        key_metric: values.keyMetric || null,
        images: uploadedImages,
        cover_url: mainImage?.url || null,
      };

      const { error: updateError } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", projectId);

      if (updateError) throw updateError;

      const currentImageUrls = uploadedImages.map((img) => img.url);
      const deletedImageUrls = originalImages.filter(
        (url) => !currentImageUrls.includes(url)
      );

      if (deletedImageUrls.length > 0) {
        await deleteProjectImages(projectId, deletedImageUrls);
      }

      if (values.technologies && values.technologies.length > 0) {
        await supabase
          .from("project_technologies")
          .delete()
          .eq("project_id", projectId);

        const techInserts = values.technologies.map((techId) => ({
          project_id: projectId,
          technology_id: techId,
        }));

        await supabase.from("project_technologies").insert(techInserts);
      }

      toast.success(project ? "Project updated!" : "Project created!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  const showOnHome = form.watch("showOnHome");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create Project"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ImageUploader images={images} onChange={setImages} />

            <div className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
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
                    <FormLabel>Technologies</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {/* Selected technologies as badges */}
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-background">
                          {field.value && field.value.length > 0 ? (
                            field.value.map((techId) => {
                              const tech = technologies.find(t => t.id === techId);
                              return tech ? (
                                <Badge key={techId} variant="secondary" className="gap-1">
                                  {tech.name}
                                  <X 
                                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                    onClick={() => {
                                      field.onChange(field.value?.filter(id => id !== techId));
                                    }} 
                                  />
                                </Badge>
                              ) : null;
                            })
                          ) : (
                            <span className="text-sm text-muted-foreground">No technologies selected</span>
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
                            <SelectValue placeholder="Add technology..." />
                          </SelectTrigger>
                          <SelectContent>
                            {technologies
                              .filter(tech => !field.value?.includes(tech.id))
                              .map((tech) => (
                                <SelectItem key={tech.id} value={tech.id}>
                                  {tech.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Select technologies used in this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Saving..." : project ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
