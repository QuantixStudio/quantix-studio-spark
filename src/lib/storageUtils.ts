import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKETS } from "@/lib/storageBuckets";

export async function deleteProjectImages(
  projectId: string,
  imageUrls: string[]
): Promise<void> {
  if (!imageUrls || imageUrls.length === 0) return;

  const filePaths = imageUrls
    .map((url) => {
      const match = url.match(/Project_images\/(.+)$/);
      return match ? match[1] : null;
    })
    .filter(Boolean) as string[];

  if (filePaths.length > 0) {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.projectImages)
      .remove(filePaths);

    if (error) {
      console.error("Failed to delete images:", error);
      throw error;
    }
  }
}

export async function deleteAllProjectImages(projectId: string): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from(STORAGE_BUCKETS.projectImages)
    .list(projectId);

  if (listError) {
    console.error("Failed to list project images:", listError);
    throw listError;
  }

  if (files && files.length > 0) {
    const filePaths = files.map((file) => `${projectId}/${file.name}`);

    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKETS.projectImages)
      .remove(filePaths);

    if (deleteError) {
      console.error("Failed to delete project folder:", deleteError);
      throw deleteError;
    }
  }
}
