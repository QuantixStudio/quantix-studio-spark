import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKETS } from "@/lib/storageBuckets";

function isPublicAssetUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:");
}

function normalizeToolLogoPath(logoPath: string): string {
  const trimmedPath = logoPath.trim().replace(/^\/+/, "");
  const bucketPrefix = `${STORAGE_BUCKETS.toolsLogos}/`;

  if (trimmedPath.startsWith(bucketPrefix)) {
    return trimmedPath.slice(bucketPrefix.length);
  }

  return trimmedPath;
}

export async function deleteToolLogo(logoPath: string): Promise<void> {
  if (!logoPath) return;

  if (isPublicAssetUrl(logoPath)) {
    return;
  }

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.toolsLogos)
    .remove([normalizeToolLogoPath(logoPath)]);

  if (error) {
    console.error("Failed to delete logo:", error);
    throw error;
  }
}

export function getToolLogoUrl(logoPath: string | null): string | null {
  if (!logoPath) return null;

  if (isPublicAssetUrl(logoPath)) {
    return logoPath;
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKETS.toolsLogos)
    .getPublicUrl(normalizeToolLogoPath(logoPath));

  return data.publicUrl;
}
