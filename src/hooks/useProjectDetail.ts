import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectCategory {
  id: string;
  name: string;
  description: string | null;
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  logo_path: string | null;
  categories: string[];
  description: string | null;
  website_url: string | null;
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
  project_tools: Tool[];
}

export function useProjectDetail(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data: project, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_category:category_id (
            id,
            name,
            description
          )
        `)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      if (!project) return null;

      // Fetch tools for this project
      const { data: projectTech } = await supabase
        .from("project_technologies")
        .select("tools")
        .eq("project_id", project.id)
        .maybeSingle();

      const toolIds = projectTech?.tools || [];

      // Fetch all tools that match the IDs
      const { data: tools } = await supabase
        .from("tools")
        .select("*")
        .in("id", toolIds.length > 0 ? toolIds : ['00000000-0000-0000-0000-000000000000']); // Avoid empty array error

      return {
        ...project,
        project_tools: tools || [],
      } as ProjectDetail;
    },
    enabled: !!slug,
  });
}
