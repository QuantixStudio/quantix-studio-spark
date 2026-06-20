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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errorUtils";
import type { AdminService, ServiceIcon } from "@/types/app";

const serviceSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(120),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1200),
  order_index: z.coerce.number().int().min(0, "Order must be 0 or greater"),
  published: z.boolean(),
  icon_id: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: AdminService | null;
  icons: Pick<ServiceIcon, "id" | "name" | "icon_url">[];
}

export default function ServiceFormModal({ isOpen, onClose, service, icons }: ServiceFormModalProps) {
  const queryClient = useQueryClient();
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      order_index: 0,
      published: false,
      icon_id: "none",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    form.reset({
      title: service?.title || "",
      description: service?.description || "",
      order_index: service?.order_index ?? 0,
      published: service?.published ?? false,
      icon_id: service?.icon_id || "none",
    });
  }, [form, isOpen, service]);

  const onSubmit = async (values: ServiceFormValues) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        order_index: values.order_index,
        published: values.published,
        icon_id: values.icon_id && values.icon_id !== "none" ? values.icon_id : null,
      };

      if (service) {
        const { error } = await supabase
          .from("services")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", service.id);

        if (error) throw error;
        toast.success("Service updated successfully");
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
        toast.success("Service created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["admin-content", "services"] });
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save service"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border bg-card/95">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add Service"}</DialogTitle>
          <DialogDescription>
            Manage public service cards that appear in the marketing site’s Services section.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="AI Features & Workflow Automation" />
                  </FormControl>
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
                    <Textarea {...field} rows={5} placeholder="Describe what this service covers and why it matters." />
                  </FormControl>
                  <FormDescription>
                    This copy is shown directly on the public landing page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="icon_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select value={field.value || "none"} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No icon</SelectItem>
                        {icons.map((icon) => (
                          <SelectItem key={icon.id} value={icon.id}>
                            {icon.name}
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

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 rounded-2xl border border-border/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <FormLabel>Published</FormLabel>
                    <FormDescription>Toggle whether this service is visible on the public site.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">{service ? "Save Changes" : "Create Service"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
