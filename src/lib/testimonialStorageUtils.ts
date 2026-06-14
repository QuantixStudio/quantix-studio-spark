import { supabase } from "@/integrations/supabase/client";

export async function deleteTestimonialAvatar(avatarPath: string): Promise<void> {
  if (!avatarPath) return;

  const { error } = await supabase.storage
    .from("testimonials_avatars")
    .remove([avatarPath]);

  if (error) {
    console.error("Failed to delete avatar:", error);
    throw error;
  }
}

export function getTestimonialAvatarUrl(avatarPath: string | null): string | null {
  if (!avatarPath) return null;

  const { data } = supabase.storage
    .from("testimonials_avatars")
    .getPublicUrl(avatarPath);

  return data.publicUrl;
}
