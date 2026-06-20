import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errorUtils";
import type {
  AdminPortfolioStatus,
  AdminProjectCategory,
  AdminTechnology,
  PortfolioStatusTab,
} from "@/types/app";

type PortfolioReferenceTab = "technologies" | "categories" | PortfolioStatusTab;
type ReferenceItem = AdminTechnology | AdminProjectCategory | AdminPortfolioStatus;

const technologySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().max(500, "Description must be less than 500 characters").optional().or(z.literal("")),
});

const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  description: z.string().max(500, "Description must be less than 500 characters").optional().or(z.literal("")),
  order_index: z.coerce.number().int().min(0, "Order must be 0 or greater"),
});

const statusSchema = z.object({
  id: z
    .string()
    .trim()
    .min(2, "ID must be at least 2 characters")
    .regex(/^[a-z0-9-_]+$/, "Use lowercase letters, numbers, hyphens, or underscores"),
  label: z.string().trim().min(2, "Label must be at least 2 characters").max(120),
  color: z.string().max(40, "Color must be less than 40 characters").optional().or(z.literal("")),
  order_index: z.coerce.number().int().min(0, "Order must be 0 or greater"),
});

type TechnologyFormValues = z.infer<typeof technologySchema>;
type CategoryFormValues = z.infer<typeof categorySchema>;
type StatusFormValues = z.infer<typeof statusSchema>;

interface PortfolioReferenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tab: PortfolioReferenceTab;
  item?: ReferenceItem | null;
}

const formConfig = {
  technologies: {
    tableName: "technologies",
    title: "Technology",
    description: "Manage reusable technology entries that projects can reference across the portfolio experience.",
    queryKey: ["portfolio-system", "technologies"] as const,
  },
  categories: {
    tableName: "project_category",
    title: "Category",
    description: "Manage project categories used for organization and public portfolio labeling.",
    queryKey: ["portfolio-system", "categories"] as const,
  },
  "project-statuses": {
    tableName: "project_status",
    title: "Project Status",
    description: "Manage project workflow states used by the admin experience.",
    queryKey: ["portfolio-system", "project-statuses"] as const,
  },
  "task-statuses": {
    tableName: "task_status",
    title: "Task Status",
    description: "Manage delivery task states used for project task tracking.",
    queryKey: ["portfolio-system", "task-statuses"] as const,
  },
} as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PortfolioReferenceFormModal({
  isOpen,
  onClose,
  tab,
  item,
}: PortfolioReferenceFormModalProps) {
  const queryClient = useQueryClient();
  const config = formConfig[tab];

  const technologyForm = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologySchema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", order_index: 0 },
  });

  const statusForm = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: { id: "", label: "", color: "", order_index: 0 },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (tab === "technologies") {
      const technology = item as AdminTechnology | null;
      technologyForm.reset({
        name: technology?.name || "",
        slug: technology?.slug || "",
        description: technology?.description || "",
      });
      return;
    }

    if (tab === "categories") {
      const category = item as AdminProjectCategory | null;
      categoryForm.reset({
        name: category?.name || "",
        description: category?.description || "",
        order_index: category?.order_index ?? 0,
      });
      return;
    }

    const status = item as AdminPortfolioStatus | null;
    statusForm.reset({
      id: status?.id || "",
      label: status?.label || "",
      color: status?.color || "",
      order_index: status?.order_index ?? 0,
    });
  }, [categoryForm, isOpen, item, statusForm, tab, technologyForm]);

  const saveAndClose = async (queryKey: readonly string[], message: string) => {
    queryClient.invalidateQueries({ queryKey });
    toast.success(message);
    onClose();
  };

  const submitTechnology = async (values: TechnologyFormValues) => {
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        description: values.description || null,
      };

      if (item) {
        const { error } = await (supabase as unknown as { from: (table: string) => any })
          .from(config.tableName)
          .update(payload)
          .eq("id", item.id);
        if (error) throw error;
        await saveAndClose(config.queryKey, "Technology updated successfully");
      } else {
        const { error } = await (supabase as unknown as { from: (table: string) => any }).from(config.tableName).insert(payload);
        if (error) throw error;
        await saveAndClose(config.queryKey, "Technology created successfully");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save technology"));
    }
  };

  const submitCategory = async (values: CategoryFormValues) => {
    try {
      const payload = {
        name: values.name,
        description: values.description || null,
        order_index: values.order_index,
      };

      if (item) {
        const { error } = await supabase.from("project_category").update(payload).eq("id", item.id);
        if (error) throw error;
        await saveAndClose(config.queryKey, "Category updated successfully");
      } else {
        const { error } = await supabase.from("project_category").insert(payload);
        if (error) throw error;
        await saveAndClose(config.queryKey, "Category created successfully");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save category"));
    }
  };

  const submitStatus = async (values: StatusFormValues) => {
    try {
      const payload = {
        id: values.id,
        label: values.label,
        color: values.color || null,
        order_index: values.order_index,
      };

      if (item) {
        const { error } = await (supabase as unknown as { from: (table: string) => any })
          .from(config.tableName)
          .update({
            label: payload.label,
            color: payload.color,
            order_index: payload.order_index,
          })
          .eq("id", item.id);

        if (error) throw error;
        await saveAndClose(config.queryKey, `${config.title} updated successfully`);
      } else {
        const { error } = await (supabase as unknown as { from: (table: string) => any }).from(config.tableName).insert(payload);
        if (error) throw error;
        await saveAndClose(config.queryKey, `${config.title} created successfully`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to save ${config.title.toLowerCase()}`));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border bg-card/95">
        <DialogHeader>
          <DialogTitle>{item ? `Edit ${config.title}` : `Add ${config.title}`}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {tab === "technologies" ? (
          <Form {...technologyForm}>
            <form onSubmit={technologyForm.handleSubmit(submitTechnology)} className="space-y-6 pb-1">
              <FormField
                control={technologyForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Supabase"
                        onChange={(event) => {
                          field.onChange(event);
                          if (!item) {
                            technologyForm.setValue("slug", slugify(event.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={technologyForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="supabase" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={technologyForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder="Optional short context for internal admins." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">{item ? "Save Changes" : "Create Technology"}</Button>
              </div>
            </form>
          </Form>
        ) : null}

        {tab === "categories" ? (
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(submitCategory)} className="space-y-6 pb-1">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="AI SaaS" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder="Short explanation for this project category." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={categoryForm.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">{item ? "Save Changes" : "Create Category"}</Button>
              </div>
            </form>
          </Form>
        ) : null}

        {tab === "project-statuses" || tab === "task-statuses" ? (
          <Form {...statusForm}>
            <form onSubmit={statusForm.handleSubmit(submitStatus)} className="space-y-6 pb-1">
              <FormField
                control={statusForm.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="in_progress" disabled={Boolean(item)} />
                    </FormControl>
                    <FormDescription>
                      {item ? "The status ID is fixed after creation to avoid breaking existing references." : "Stable internal identifier used by related records."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={statusForm.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="In Progress" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={statusForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="#22c55e" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={statusForm.control}
                  name="order_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={0} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">{item ? "Save Changes" : `Create ${config.title}`}</Button>
              </div>
            </form>
          </Form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
