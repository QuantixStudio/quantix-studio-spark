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

interface ProjectDetail {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string | null;
  cover_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  project_category: ProjectCategory | null;
  project_technologies: Array<{ technologies: Technology }>;
}

export function useProjectDetail(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
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
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      return data as ProjectDetail | null;
    },
    enabled: !!slug,
  });
}
