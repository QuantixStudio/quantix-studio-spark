import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import LogoUploader from "./LogoUploader";
import { Tool } from "@/hooks/useTools";
import { compressImage } from "@/lib/imageUtils";
import { deleteToolLogo, getToolLogoUrl } from "@/lib/toolStorageUtils";

const toolSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  category: z.enum(["Frontend", "Backend", "Database", "AI", "Automation", "Design"]),
  description: z.string().max(500, "Description must be less than 500 characters").optional().or(z.literal("")),
  website_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_featured: z.boolean(),
});

type ToolFormValues = z.infer<typeof toolSchema>;

interface ToolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool?: Tool | null;
}

export default function ToolFormModal({
  isOpen,
  onClose,
  tool,
}: ToolFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "Frontend",
      description: "",
      website_url: "",
      is_featured: false,
    },
  });

  useEffect(() => {
    if (isOpen && tool) {
      form.reset({
        name: tool.name,
        slug: tool.slug,
        category: tool.category as any,
        description: tool.description || "",
        website_url: tool.website_url || "",
        is_featured: tool.is_featured,
      });
      setExistingLogoUrl(getToolLogoUrl(tool.logo_path));
      setLogoFile(null);
    } else if (isOpen && !tool) {
      form.reset({
        name: "",
        slug: "",
        category: "Frontend",
        description: "",
        website_url: "",
        is_featured: false,
      });
      setExistingLogoUrl(null);
      setLogoFile(null);
    }
  }, [isOpen, tool, form]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (name: string) => {
    form.setValue("name", name);
    if (!tool) {
      form.setValue("slug", generateSlug(name));
    }
  };

  const uploadLogo = async (toolId: string): Promise<string | null> => {
    if (!logoFile) return null;

    try {
      const compressedFile = await compressImage(logoFile, 2);
      const fileExt = logoFile.name.split(".").pop();
      const fileName = `${toolId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("tools_logos")
        .upload(fileName, compressedFile, {
          upsert: true,
          contentType: compressedFile.type,
        });

      if (uploadError) throw uploadError;

      return fileName;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const onSubmit = async (values: ToolFormValues) => {
    setIsLoading(true);

    try {
      if (tool) {
        // Update existing tool
        let logoPath = tool.logo_path;

        if (logoFile) {
          // Delete old logo if exists
          if (tool.logo_path) {
            await deleteToolLogo(tool.logo_path);
          }
          // Upload new logo
          logoPath = await uploadLogo(tool.id);
        }

        const { error } = await supabase
          .from("tools" as any)
          .update({
            name: values.name,
            slug: values.slug,
            category: values.category,
            description: values.description || null,
            website_url: values.website_url || null,
            logo_path: logoPath,
            is_featured: values.is_featured,
          })
          .eq("id", tool.id);

        if (error) throw error;

        toast.success("Tool updated successfully");
      } else {
        // Create new tool
        const { data: newTool, error: insertError } = await supabase
          .from("tools" as any)
          .insert({
            name: values.name,
            slug: values.slug,
            category: values.category,
            description: values.description || null,
            website_url: values.website_url || null,
            is_featured: values.is_featured,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Upload logo if provided
        if (logoFile && newTool) {
          const logoPath = await uploadLogo((newTool as any).id);
          if (logoPath) {
            await supabase
              .from("tools" as any)
              .update({ logo_path: logoPath })
              .eq("id", (newTool as any).id);
          }
        }

        toast.success("Tool created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["tools"] });
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to save tool");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tool ? "Edit Tool" : "Add New Tool"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <LogoUploader
                  value={logoFile}
                  onChange={setLogoFile}
                  existingLogoUrl={existingLogoUrl}
                />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Bubble"
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
                    <Input {...field} placeholder="e.g., bubble" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="AI">AI</SelectItem>
                      <SelectItem value="Automation">Automation</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief description of the tool..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Show this tool in the tech stack section
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : tool ? "Update Tool" : "Create Tool"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
