import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/lib/imageUtils";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

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
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [technologies, setTechnologies] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      technologies: project?.project_technologies?.map((pt: any) => pt.technologies.id) || [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchTechnologies();
      if (project?.cover_url) {
        setCoverPreview(project.cover_url);
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

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    try {
      const compressed = await compressImage(file, 1);
      setCoverFile(compressed);
      setCoverPreview(URL.createObjectURL(compressed));
    } catch (error) {
      toast.error("Failed to process image");
    }
  };

  const uploadCover = async (projectId: string): Promise<string | null> => {
    if (!coverFile) return null;

    const fileExt = coverFile.name.split(".").pop();
    const fileName = `${projectId}/cover-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(fileName, coverFile, { upsert: true });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio").getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    setIsLoading(true);
    try {
      let projectId = project?.id;
      let coverUrl = coverPreview;

      if (!projectId) {
        const { data: newProject, error: insertError } = await supabase
          .from("projects")
          .insert({
            title: values.title,
            slug: values.slug,
            short_description: values.shortDescription,
            full_description: values.fullDescription || null,
            category_id: values.categoryId || null,
            demo_url: values.demoUrl || null,
            github_url: values.githubUrl || null,
            published: values.published,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        projectId = newProject.id;
      } else {
        const { error: updateError } = await supabase
          .from("projects")
          .update({
            title: values.title,
            slug: values.slug,
            short_description: values.shortDescription,
            full_description: values.fullDescription || null,
            category_id: values.categoryId || null,
            demo_url: values.demoUrl || null,
            github_url: values.githubUrl || null,
            published: values.published,
          })
          .eq("id", projectId);

        if (updateError) throw updateError;
      }

      if (coverFile) {
        const uploadedUrl = await uploadCover(projectId);
        if (uploadedUrl) coverUrl = uploadedUrl;
      }

      if (coverUrl && coverUrl !== project?.cover_url) {
        await supabase
          .from("projects")
          .update({ cover_url: coverUrl })
          .eq("id", projectId);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create Project"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Cover
                  </Button>
                  {coverPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

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
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Published (visible on landing page)
                    </FormLabel>
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
