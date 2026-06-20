import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { compressImage } from "@/lib/imageUtils";
import { STORAGE_BUCKETS } from "@/lib/storageBuckets";
import { getErrorMessage } from "@/lib/errorUtils";
import type { AdminProfile } from "@/types/app";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AvatarUploader from "./AvatarUploader";

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Email is too long"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().or(z.literal("")),
  role: z.enum(["admin", "manager", "client"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AdminProfile | null;
}

export default function ProfileFormModal({ isOpen, onClose, profile }: ProfileFormModalProps) {
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarCleared, setAvatarCleared] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      email: "",
      bio: "",
      role: "client",
    },
  });

  useEffect(() => {
    if (!isOpen || !profile) return;

    form.reset({
      full_name: profile.full_name || "",
      email: profile.email || "",
      bio: profile.bio || "",
      role: profile.role === "admin" || profile.role === "manager" || profile.role === "client" ? profile.role : "client",
    });
    setAvatarFile(null);
    setAvatarCleared(false);
  }, [form, isOpen, profile]);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    setAvatarCleared(file === null);
  };

  const uploadAvatar = async (targetProfileId: string, file: File) => {
    const compressedFile = await compressImage(file, 2);
    const fileExt = compressedFile.name.split(".").pop() || "jpg";
    const fileName = `${targetProfileId}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.avatars)
      .upload(fileName, compressedFile, { contentType: compressedFile.type });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(STORAGE_BUCKETS.avatars).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!profile) return;

    setIsSaving(true);
    try {
      let avatarUrl = profile.avatar_url;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(profile.id, avatarFile);
      } else if (avatarCleared) {
        avatarUrl = null;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
          email: values.email,
          bio: values.bio || null,
          role: values.role,
          avatar_url: avatarUrl,
        })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profiles"] }),
        queryClient.invalidateQueries({
          predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "current-profile",
        }),
      ]);

      toast.success("Profile updated successfully");
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl border bg-card/95">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update account details, role, biography, and avatar for this profile.
          </DialogDescription>
        </DialogHeader>

        {profile ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <AvatarUploader
                    key={`${profile.id}-${profile.avatar_url ?? "no-avatar"}`}
                    value={avatarFile}
                    onChange={handleAvatarChange}
                    existingAvatarUrl={avatarCleared ? null : profile.avatar_url}
                  />
                </FormControl>
              </FormItem>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="name@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} placeholder="Short internal bio or context for this account." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">admin</SelectItem>
                          <SelectItem value="manager">manager</SelectItem>
                          <SelectItem value="client">client</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
