import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  ProjectImage,
  ProjectStatusSummary,
  ProjectTechnologySummary,
  ProjectWithTools,
} from "@/types/app";

const untypedSupabase = supabase as unknown as {
  from: (relation: string) => any;
};

interface ProjectCategorySummary {
  id: string;
  name: string;
  description: string | null;
}

interface ProjectImageRow {
  public_url: string | null;
  alt: string | null;
  is_main: boolean | null;
  order_index: number | null;
}

interface RawProjectRow {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description?: string | null;
  demo_url?: string | null;
  github_url?: string | null;
  key_metric: string | null;
  show_on_home: boolean | null;
  published: boolean | null;
  created_at: string | null;
  category_id: string | null;
  status: string | null;
  project_category: ProjectCategorySummary | null;
  project_images?: ProjectImageRow[] | null;
  cover_image?: ProjectImageRow | ProjectImageRow[] | null;
  project_status?: ProjectStatusSummary | null;
}

function normalizeRelatedImage(
  image: ProjectImageRow | ProjectImageRow[] | null | undefined,
): ProjectImageRow | null {
  if (!image) {
    return null;
  }

  if (Array.isArray(image)) {
    return image[0] ?? null;
  }

  return image;
}

function mapProjectImages(
  images: ProjectImageRow[] | null | undefined,
  coverImage: ProjectImageRow | ProjectImageRow[] | null | undefined,
  fallbackTitle: string,
): ProjectImage[] {
  const normalizedImages = (images ?? [])
    .filter((image): image is ProjectImageRow => Boolean(image?.public_url))
    .map((image, index) => ({
      url: image.public_url ?? "",
      alt: image.alt ?? fallbackTitle,
      is_main: image.is_main ?? index === 0,
      order: image.order_index ?? index,
    }))
    .sort((left, right) => left.order - right.order);

  if (normalizedImages.length > 0 && !normalizedImages.some((image) => image.is_main)) {
    normalizedImages[0].is_main = true;
  }

  if (normalizedImages.length > 0) {
    return normalizedImages;
  }

  const fallbackImage = normalizeRelatedImage(coverImage);

  if (fallbackImage?.public_url) {
    return [
      {
        url: fallbackImage.public_url,
        alt: fallbackImage.alt ?? fallbackTitle,
        is_main: true,
        order: fallbackImage.order_index ?? 0,
      },
    ];
  }

  return normalizedImages;
}

function mapProject(
  project: RawProjectRow,
  technologies: ProjectTechnologySummary[],
): ProjectWithTools {
  const images = mapProjectImages(project.project_images, project.cover_image, project.title);
  const coverUrl = images.find((image) => image.is_main)?.url ?? images[0]?.url ?? null;

  return {
    ...project,
    short_description: project.short_description?.trim() || "Project details coming soon.",
    images,
    cover_url: coverUrl,
    published: project.published ?? false,
    show_on_home: project.show_on_home ?? false,
    status: project.status ?? null,
    client_id: null,
    cover_image_id: null,
    project_status: project.project_status ?? null,
    client: null,
    project_technologies: technologies,
    project_files: [],
    project_services: [],
    project_tasks: [],
    project_tools: technologies.map((technology) => ({
      id: technology.id,
      name: technology.name,
      slug: technology.name.toLowerCase().replace(/\s+/g, "-"),
      description: null,
      website_url: null,
      logo_path: null,
      is_featured: false,
      created_at: null,
      updated_at: null,
    })),
  } as ProjectWithTools;
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
          full_description,
          demo_url,
          github_url,
          key_metric,
          show_on_home,
          published,
          created_at,
          category_id,
          status,
          project_category:project_category!fk_project_category (
            id,
            name,
            description
          ),
          cover_image:project_images!projects_cover_image_id_fkey (
            public_url,
            alt,
            is_main,
            order_index
          ),
          project_images:project_images!project_images_project_fk (
            public_url,
            alt,
            is_main,
            order_index
          )
        `);

      query = adminMode
        ? query.order("created_at", { ascending: false })
        : query.order("order_index", { ascending: true });

      if (!adminMode) {
        query = query.eq("published", true);
      }

      if (featuredOnly) {
        query = query.eq("show_on_home", true);
      } else if (!adminMode) {
        query = query.limit(12);
      }

      const { data: projectsData, error } = await query;
      if (error) throw error;

      const projects = (projectsData ?? []) as unknown as RawProjectRow[];
      const statusIds = Array.from(
        new Set(projects.map((project) => project.status).filter((status): status is string => Boolean(status))),
      );

      const statusMap = new Map<string, ProjectStatusSummary>();

      if (statusIds.length > 0) {
        const { data: statusRows, error: statusError } = await untypedSupabase
          .from("project_status")
          .select("id, label, color, order_index")
          .in("id", statusIds);

        if (statusError) {
          console.warn("Could not load project statuses", statusError);
        } else {
          for (const status of statusRows ?? []) {
            statusMap.set(status.id, status as ProjectStatusSummary);
          }
        }
      }

      const projectsWithTechnologies = await Promise.all(
        projects.map(async (project) => {
          const { data: projectTechRows, error: projectTechError } = await untypedSupabase
            .from("project_technologies")
            .select(`
              technology_id,
              technologies:technologies!fk_pt_technology (
                id,
                name
              )
            `)
            .eq("project_id", project.id);

          if (projectTechError) {
            console.warn(`Could not load technologies for project ${project.id}`, projectTechError);
            return mapProject(project, []);
          }

          const technologies = (projectTechRows ?? [])
            .map((row) => {
              const technology = (row as { technologies: ProjectTechnologySummary | ProjectTechnologySummary[] | null }).technologies;
              return Array.isArray(technology) ? technology[0] : technology;
            })
            .filter((technology): technology is ProjectTechnologySummary => Boolean(technology?.id && technology?.name));

          return mapProject(
            {
              ...project,
              project_status: project.status ? statusMap.get(project.status) ?? null : null,
            },
            technologies,
          );
        }),
      );

      return projectsWithTechnologies;
    },
  });
}
