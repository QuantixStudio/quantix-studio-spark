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
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import LogoUploader from "./LogoUploader";
import { compressImage } from "@/lib/imageUtils";
import { getErrorMessage } from "@/lib/errorUtils";
import { deleteToolLogo, getToolLogoUrl } from "@/lib/toolStorageUtils";
import { STORAGE_BUCKETS } from "@/lib/storageBuckets";
import type { Tool } from "@/types/app";

const toolSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
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

interface ToolIdentityRow {
  id: string;
}

async function ensureUniqueToolSlug(slug: string, currentToolId?: string) {
  const { data, error } = await supabase
    .from("tools")
    .select("id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data && data.id !== currentToolId) {
    throw new Error(`Tool slug "${slug}" is already in use. Please choose a different slug.`);
  }
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
        description: tool.description || "",
        website_url: tool.website_url || "",
        is_featured: tool.is_featured ?? false,
      });
      setExistingLogoUrl(getToolLogoUrl(tool.logo_path));
      setLogoFile(null);
    } else if (isOpen && !tool) {
      form.reset({
        name: "",
        slug: "",
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
        .from(STORAGE_BUCKETS.toolsLogos)
        .upload(fileName, compressedFile, {
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
    let createdToolId: string | undefined;

    try {
      await ensureUniqueToolSlug(values.slug, tool?.id);

      if (tool) {
        // Update existing tool
        let logoPath = tool.logo_path;
        let previousLogoPath: string | null = tool.logo_path;

        if (logoFile) {
          logoPath = await uploadLogo(tool.id);
        }

        const { error } = await supabase
          .from("tools")
          .update({
            name: values.name,
            slug: values.slug,
            description: values.description || null,
            website_url: values.website_url || null,
            logo_path: logoPath,
            is_featured: values.is_featured,
            updated_at: new Date().toISOString(),
          })
          .eq("id", tool.id);

        if (error) throw error;

        if (logoFile && previousLogoPath && previousLogoPath !== logoPath) {
          await deleteToolLogo(previousLogoPath);
        }

        toast.success("Tool updated successfully");
      } else {
        // Create new tool
        const timestamp = new Date().toISOString();
        const newToolId = crypto.randomUUID();

        const insertQuery = supabase.from("tools") as unknown as {
          insert: (values: Record<string, unknown>) => {
            select: (columns: string) => {
              single: () => Promise<{ data: ToolIdentityRow | null; error: Error | null }>;
            };
          };
        };

        const { data: newTool, error: insertError } = await insertQuery
          .insert({
            id: newToolId,
            name: values.name,
            slug: values.slug,
            description: values.description || null,
            website_url: values.website_url || null,
            is_featured: values.is_featured,
            created_at: timestamp,
            updated_at: timestamp,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;
        createdToolId = newTool?.id ?? newToolId;

        // Upload logo if provided
        if (logoFile && newTool) {
          const logoPath = await uploadLogo(newTool.id);
          if (logoPath) {
            const { error: logoUpdateError } = await supabase
              .from("tools")
              .update({ logo_path: logoPath, updated_at: new Date().toISOString() })
              .eq("id", newTool.id);

            if (logoUpdateError) {
              throw logoUpdateError;
            }
          }
        }

        toast.success("Tool created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["tools"] });
      onClose();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Tool slug "')) {
        form.setError("slug", { type: "manual", message: error.message });
      }

      if (createdToolId) {
        try {
          await supabase.from("tools").delete().eq("id", createdToolId);
        } catch (cleanupError) {
          console.error("Failed to rollback partially created tool", cleanupError);
        }
      }

      console.error("Submit error:", error);
      toast.error(getErrorMessage(error, "Failed to save tool"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border bg-card/95">
        <DialogHeader>
          <DialogTitle>{tool ? "Edit Tool" : "Add New Tool"}</DialogTitle>
          <DialogDescription>
            Tools power your public stack, project metadata, and featured logo carousel.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-1">
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
                  <FormDescription>Choose the product name visitors will recognize instantly.</FormDescription>
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
                  <FormDescription>Used for clean URLs and internal references.</FormDescription>
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

            <div className="flex flex-col-reverse gap-2 border-t border-border/70 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Saving..." : tool ? "Update Tool" : "Create Tool"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
