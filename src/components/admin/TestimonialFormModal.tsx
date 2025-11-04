import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AvatarUploader from "./AvatarUploader";
import { Testimonial } from "@/hooks/useAdminTestimonials";
import { compressImage } from "@/lib/imageUtils";
import { deleteTestimonialAvatar, getTestimonialAvatarUrl } from "@/lib/testimonialStorageUtils";

const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  company: z.string().max(100).optional().or(z.literal("")),
  position: z.string().max(100).optional().or(z.literal("")),
  feedback: z.string().min(10, "Feedback must be at least 10 characters").max(1000),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  order_index: z.number().int().min(0).optional(),
  published: z.boolean(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface TestimonialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial?: Testimonial | null;
}

export default function TestimonialFormModal({
  isOpen,
  onClose,
  testimonial,
}: TestimonialFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      company: "",
      position: "",
      feedback: "",
      rating: null,
      order_index: 0,
      published: false,
    },
  });

  useEffect(() => {
    if (isOpen && testimonial) {
      form.reset({
        name: testimonial.name,
        company: testimonial.company || "",
        position: testimonial.position || "",
        feedback: testimonial.feedback,
        rating: testimonial.rating,
        order_index: testimonial.order_index,
        published: testimonial.published,
      });
      setExistingAvatarUrl(getTestimonialAvatarUrl(testimonial.avatar_url));
      setAvatarFile(null);
    } else if (isOpen && !testimonial) {
      form.reset({
        name: "",
        company: "",
        position: "",
        feedback: "",
        rating: null,
        order_index: 0,
        published: false,
      });
      setExistingAvatarUrl(null);
      setAvatarFile(null);
    }
  }, [isOpen, testimonial, form]);

  const uploadAvatar = async (testimonialId: string): Promise<string | null> => {
    if (!avatarFile) return null;

    try {
      const compressedFile = await compressImage(avatarFile, 2);
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `testimonials/${testimonialId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("testimonials_avatars")
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

  const onSubmit = async (values: TestimonialFormValues) => {
    setIsLoading(true);

    try {
      if (testimonial) {
        // Update existing testimonial
        let avatarPath = testimonial.avatar_url;

        if (avatarFile) {
          // Delete old avatar if exists
          if (testimonial.avatar_url) {
            await deleteTestimonialAvatar(testimonial.avatar_url);
          }
          // Upload new avatar
          avatarPath = await uploadAvatar(testimonial.id);
        }

        const { error } = await supabase
          .from("testimonials")
          .update({
            name: values.name,
            company: values.company || null,
            position: values.position || null,
            feedback: values.feedback,
            rating: values.rating,
            order_index: values.order_index,
            avatar_url: avatarPath,
            published: values.published,
          })
          .eq("id", testimonial.id);

        if (error) throw error;

        toast.success("Testimonial updated successfully");
      } else {
        // Create new testimonial
        const { data: newTestimonial, error: insertError } = await supabase
          .from("testimonials")
          .insert({
            name: values.name,
            company: values.company || null,
            position: values.position || null,
            feedback: values.feedback,
            rating: values.rating,
            order_index: values.order_index || 0,
            published: values.published,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Upload avatar if provided
        if (avatarFile && newTestimonial) {
          const avatarPath = await uploadAvatar(newTestimonial.id);
          if (avatarPath) {
            await supabase
              .from("testimonials")
              .update({ avatar_url: avatarPath })
              .eq("id", newTestimonial.id);
          }
        }

        toast.success("Testimonial created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to save testimonial");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <AvatarUploader
                  value={avatarFile}
                  onChange={setAvatarFile}
                  existingAvatarUrl={existingAvatarUrl}
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
                    <Input {...field} placeholder="e.g., John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Acme Inc." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., CEO" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your experience..."
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value ? parseInt(value) : null)
                      }
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                        <SelectItem value="2">⭐⭐ (2)</SelectItem>
                        <SelectItem value="1">⭐ (1)</SelectItem>
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
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                      />
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
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this testimonial visible on the website
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
                {isLoading
                  ? "Saving..."
                  : testimonial
                  ? "Update Testimonial"
                  : "Create Testimonial"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
