import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKETS } from "@/lib/storageBuckets";

function normalizeProjectFilePath(filePath: string): string {
  const trimmedPath = filePath.trim().replace(/^\/+/, "");
  const bucketPrefix = `${STORAGE_BUCKETS.projectFiles}/`;

  if (trimmedPath.startsWith(bucketPrefix)) {
    return trimmedPath.slice(bucketPrefix.length);
  }

  return trimmedPath;
}

function extractProjectFilePath(fileUrl: string): string | null {
  try {
    const decodedUrl = decodeURIComponent(fileUrl);
    const match = decodedUrl.match(/project_files\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function uploadProjectFile(projectId: string, file: File): Promise<{
  filePath: string;
  publicUrl: string;
}> {
  const fileExt = file.name.includes(".") ? file.name.split(".").pop() : "";
  const safeExt = fileExt ? `.${fileExt}` : "";
  const fileName = `${projectId}/${Date.now()}-${crypto.randomUUID()}${safeExt}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.projectFiles)
    .upload(fileName, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.projectFiles).getPublicUrl(fileName);

  return {
    filePath: fileName,
    publicUrl,
  };
}

export async function deleteProjectFileByUrl(fileUrl: string): Promise<void> {
  const extractedPath = extractProjectFilePath(fileUrl);

  if (!extractedPath) {
    return;
  }

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.projectFiles)
    .remove([normalizeProjectFilePath(extractedPath)]);

  if (error) {
    throw error;
  }
}
