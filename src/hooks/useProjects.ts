import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapProjectWithTools } from "@/lib/projectUtils";
import type { ProjectWithTools, RawProjectWithCategory, Tool } from "@/types/app";

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
          project_category:project_category!projects_category_id_fkey (
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

      const { data: projectsData, error } = await query;
      if (error) throw error;

      // Fetch all tools
      const { data: allToolsData, error: allToolsError } = await supabase
        .from("tools")
        .select("*");
      if (allToolsError) throw allToolsError;

      const projects = (projectsData ?? []) as RawProjectWithCategory[];
      const allTools = (allToolsData ?? []) as Tool[];

      // For each project, get its tools from project_technologies
      const projectsWithTools = await Promise.all(
        projects.map(async (project) => {
          const { data: projectTech, error: projectTechError } = await supabase
            .from("project_technologies")
            .select("tools")
            .eq("project_id", project.id)
            .maybeSingle();
          if (projectTechError) throw projectTechError;

          const toolIds = projectTech?.tools || [];
          const projectTools = allTools.filter((tool) => toolIds.includes(tool.id));

          return mapProjectWithTools(project, projectTools);
        })
      );

      return projectsWithTools as ProjectWithTools[];
    },
  });
}
