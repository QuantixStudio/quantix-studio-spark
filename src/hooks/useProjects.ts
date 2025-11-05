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
  project_tools: Tool[];
}

export function useProjects(adminMode = false, featuredOnly = false) {
  return useQuery({
    queryKey: ["projects", adminMode ? "all" : "published", featuredOnly ? "featured" : "all"],
    queryFn: async () => {
      // Fetch projects
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

      const { data: projects, error } = await query;
      if (error) throw error;

      // Fetch all tools
      const { data: allTools } = await supabase
        .from("tools")
        .select("*");

      // For each project, get its tools from project_technologies
      const projectsWithTools = await Promise.all(
        (projects || []).map(async (project) => {
          const { data: projectTech } = await supabase
            .from("project_technologies")
            .select("tools")
            .eq("project_id", project.id)
            .maybeSingle();

          const toolIds = projectTech?.tools || [];
          const projectTools = allTools?.filter(tool => toolIds.includes(tool.id)) || [];

          return {
            ...project,
            project_tools: projectTools,
          };
        })
      );

      return projectsWithTools as Project[];
    },
  });
}
