import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  cover_url: string | null;
  category: string | null;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, slug, short_description, cover_url, category")
        .eq("published", true)
        .order("order_index", { ascending: true })
        .limit(6);

      if (error) throw error;
      return data as Project[];
    },
  });
}
