import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectCategory {
  id: string;
  name: string;
  description: string | null;
}

interface Technology {
  id: string;
  name: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  cover_url: string | null;
  images: any[] | null;
  key_metric: string | null;
  show_on_home: boolean;
  published: boolean;
  created_at: string;
  category_id: string | null;
  project_category: ProjectCategory | null;
  project_technologies: Array<{ technologies: Technology }>;
}

export function useProjects(adminMode = false, featuredOnly = false) {
  return useQuery({
    queryKey: ["projects", adminMode ? "all" : "published", featuredOnly ? "featured" : "all"],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select(`
          id,
          title,
          slug,
          short_description,
          cover_url,
          images,
          key_metric,
          show_on_home,
          published,
          created_at,
          category_id,
          project_category:category_id (
            id,
            name,
            description
          ),
          project_technologies (
            technologies (
              id,
              name
            )
          )
        `)
        .order("order_index", { ascending: true });

      if (!adminMode) {
        query = query.eq("published", true);
      }

      if (featuredOnly) {
        query = query.eq("show_on_home", true).limit(4);
      } else if (!adminMode) {
        query = query.limit(12);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Project[];
    },
  });
}
