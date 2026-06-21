import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tool } from "@/types/app";

export type { Tool } from "@/types/app";

export const useTools = () => {
  return useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const toolsQuery = supabase.from("tools") as unknown as {
        select: (columns: string) => {
          order: (
            column: string,
            options: { ascending: boolean },
          ) => Promise<{ data: Tool[] | null; error: Error | null }>;
        };
      };

      const { data, error } = await toolsQuery
        .select(`
          id,
          name,
          slug,
          description,
          website_url,
          logo_path,
          is_featured,
          created_at,
          updated_at
        `)
        .order("name", { ascending: true });

      if (error) throw error;
      return (data ?? []) as Tool[];
    },
  });
};
