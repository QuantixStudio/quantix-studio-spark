import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapProjectWithTools } from "@/lib/projectUtils";
import type { ProjectWithTools, RawProjectWithCategory, Tool } from "@/types/app";

export function useProjectDetail(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data: projectData, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_category:project_category!projects_category_id_fkey (
            id,
            name,
            description
          )
        `)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      if (!projectData) return null;

      // Fetch tools for this project
      const { data: projectTech, error: projectTechError } = await supabase
        .from("project_technologies")
        .select("tools")
        .eq("project_id", projectData.id)
        .maybeSingle();
      if (projectTechError) throw projectTechError;

      const toolIds = projectTech?.tools || [];

      let projectTools: Tool[] = [];

      if (toolIds.length > 0) {
        const { data: toolsData, error: toolsError } = await supabase
          .from("tools")
          .select("*")
          .in("id", toolIds);
        if (toolsError) throw toolsError;
        projectTools = (toolsData ?? []) as Tool[];
      }

      return mapProjectWithTools(
        projectData as RawProjectWithCategory,
        projectTools,
      ) as ProjectWithTools;
    },
    enabled: !!slug,
  });
}
