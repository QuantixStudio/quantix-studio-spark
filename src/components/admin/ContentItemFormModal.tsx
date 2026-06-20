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
import type { AdminContentItem, ContentTab } from "@/types/app";

const contentItemSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(140),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1200),
  order: z.coerce.number().int().min(1, "Order must be 1 or greater"),
});

type ContentItemFormValues = z.infer<typeof contentItemSchema>;

interface ContentItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: AdminContentItem | null;
  tab: Extract<ContentTab, "how-we-work" | "why-choose-us">;
}

const contentConfig = {
  "how-we-work": {
    table: "how_we_work",
    title: "How We Work",
    description: "Manage the process steps that explain your delivery workflow on the public site.",
    createLabel: "Create Step",
  },
  "why-choose-us": {
    table: "why_choose_us",
    title: "Why Choose Us",
    description: "Manage the value-prop cards that support the trust section on the landing page.",
    createLabel: "Create Item",
  },
} as const;

export default function ContentItemFormModal({ isOpen, onClose, item, tab }: ContentItemFormModalProps) {
  const queryClient = useQueryClient();
  const config = contentConfig[tab];
  const form = useForm<ContentItemFormValues>({
    resolver: zodResolver(contentItemSchema),
    defaultValues: {
      title: "",
      description: "",
      order: 1,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    form.reset({
      title: item?.title || "",
      description: item?.description || "",
      order: item?.order ?? 1,
    });
  }, [form, isOpen, item]);

  const onSubmit = async (values: ContentItemFormValues) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        order: values.order,
      };

      if (item) {
        const { error } = await (supabase as unknown as { from: (table: string) => any })
          .from(config.table)
          .update(payload)
          .eq("id", item.id);

        if (error) throw error;
        toast.success(`${config.title} item updated successfully`);
      } else {
        const { error } = await (supabase as unknown as { from: (table: string) => any })
          .from(config.table)
          .insert(payload);

        if (error) throw error;
        toast.success(`${config.title} item created successfully`);
      }

      queryClient.invalidateQueries({ queryKey: ["admin-content", tab] });
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to save ${config.title} item`));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border bg-card/95">
        <DialogHeader>
          <DialogTitle>{item ? `Edit ${config.title} Item` : `Add ${config.title} Item`}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
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
                    <Input {...field} placeholder="Enter a short, clear title" />
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
                    <Textarea {...field} rows={5} placeholder="Write the supporting content shown on the site." />
                  </FormControl>
                  <FormDescription>
                    Icons remain derived in the UI for v1; this editor controls only text and ordering.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">{item ? "Save Changes" : config.createLabel}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
