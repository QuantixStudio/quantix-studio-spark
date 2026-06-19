import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  ProjectImage,
  ProjectServiceSummary,
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

interface ServiceSummary {
  id: string;
  title: string;
  description: string | null;
}

interface ProjectImageRow {
  id: string;
  file_path: string | null;
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
  full_description: string | null;
  demo_url: string | null;
  github_url: string | null;
  key_metric: string | null;
  show_on_home: boolean | null;
  published: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  category_id: string | null;
  project_category: ProjectCategorySummary | null;
  project_images?: ProjectImageRow[] | null;
  cover_image?: ProjectImageRow | ProjectImageRow[] | null;
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
      id: image.id,
      url: image.public_url ?? "",
      alt: image.alt ?? fallbackTitle,
      is_main: image.is_main ?? index === 0,
      order: image.order_index ?? index,
      file_path: image.file_path ?? null,
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
        id: fallbackImage.id,
        url: fallbackImage.public_url,
        alt: fallbackImage.alt ?? fallbackTitle,
        is_main: true,
        order: fallbackImage.order_index ?? 0,
        file_path: fallbackImage.file_path ?? null,
      },
    ];
  }

  return normalizedImages;
}

function mapProject(
  project: RawProjectRow,
  technologies: ProjectTechnologySummary[],
  projectServices: ProjectServiceSummary[],
): ProjectWithTools {
  return {
    ...project,
    short_description: project.short_description?.trim() || "Project details coming soon.",
    images: mapProjectImages(project.project_images, project.cover_image, project.title),
    cover_url: null,
    published: project.published ?? false,
    show_on_home: project.show_on_home ?? false,
    status: null,
    client_id: null,
    cover_image_id: null,
    project_status: null,
    client: null,
    project_technologies: technologies,
    project_files: [],
    project_services: projectServices,
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

export function useProjectDetail(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data: projectData, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_category:project_category!fk_project_category (
            id,
            name,
            description
          ),
          cover_image:project_images!projects_cover_image_id_fkey (
            id,
            file_path,
            public_url,
            alt,
            is_main,
            order_index
          ),
          project_images:project_images!project_images_project_fk (
            id,
            file_path,
            public_url,
            alt,
            is_main,
            order_index
          )
        `)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      if (!projectData) return null;

      // Fetch tools for this project
      const { data: projectTechRows, error: projectTechError } = await untypedSupabase
        .from("project_technologies")
        .select(`
          technology_id,
          technologies:technologies!fk_pt_technology (
            id,
            name
          )
        `)
        .eq("project_id", projectData.id);
      if (projectTechError) {
        console.warn(`Could not load technologies for project ${projectData.id}`, projectTechError);
      }

      const technologies = ((projectTechRows ?? []) as Array<{ technologies: ProjectTechnologySummary | ProjectTechnologySummary[] | null }>)
        .map((row) => {
          const technology = (row as { technologies: ProjectTechnologySummary | ProjectTechnologySummary[] | null }).technologies;
          return Array.isArray(technology) ? technology[0] : technology;
        })
        .filter((technology): technology is ProjectTechnologySummary => Boolean(technology?.id && technology?.name));

      const { data: projectServiceRows, error: projectServicesError } = await untypedSupabase
        .from("project_services")
        .select("service_id")
        .eq("project_id", projectData.id);

      if (projectServicesError) {
        console.warn(`Could not load services for project ${projectData.id}`, projectServicesError);
      }

      const serviceIds = ((projectServiceRows ?? []) as Array<{ service_id: string | null }>)
        .map((row) => row.service_id)
        .filter((serviceId): serviceId is string => Boolean(serviceId));
      let projectServices: ServiceSummary[] = [];

      if (serviceIds.length > 0) {
        const { data: serviceRows, error: servicesError } = await supabase
          .from("services")
          .select("id, title, description")
          .in("id", serviceIds);

        if (servicesError) {
          console.warn(`Could not load services catalog for project ${projectData.id}`, servicesError);
        } else {
          projectServices = (serviceRows ?? []) as ServiceSummary[];
        }
      }

      return mapProject(projectData as unknown as RawProjectRow, technologies, projectServices);
    },
    enabled: !!slug,
  });
}
