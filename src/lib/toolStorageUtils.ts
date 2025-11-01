import { supabase } from "@/integrations/supabase/client";

export async function deleteToolLogo(logoPath: string): Promise<void> {
  if (!logoPath) return;

  const { error } = await supabase.storage
    .from("tools_logos")
    .remove([logoPath]);

  if (error) {
    console.error("Failed to delete logo:", error);
    throw error;
  }
}

export function getToolLogoUrl(logoPath: string | null): string | null {
  if (!logoPath) return null;

  const { data } = supabase.storage
    .from("tools_logos")
    .getPublicUrl(logoPath);

  return data.publicUrl;
}
