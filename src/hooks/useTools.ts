import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  website_url: string | null;
  logo_path: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useTools = () => {
  return useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools" as any)
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as unknown as Tool[];
    },
  });
};
