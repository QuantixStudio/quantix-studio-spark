import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  ProjectFileSummary,
  ProjectImage,
  ProjectServiceSummary,
  ProjectTechnologySummary,
  ProjectWithTools,
} from "@/types/app";

interface ProjectCategorySummary {
  id: string;
  name: string;
  description: string | null;
}

interface ServiceSummary {
  id: string;
  title: string;
  description: string;
}

interface ProjectImageRow {
  public_url: string | null;
  alt: string | null;
  is_main: boolean | null;
  order_index: number | null;
}

interface ProjectFileRow {
  id: string;
  file_url: string;
  file_type: string | null;
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
  projectFiles: ProjectFileSummary[],
  projectServices: ProjectServiceSummary[],
): ProjectWithTools {
  return {
    ...project,
    short_description: project.short_description?.trim() || "Project details coming soon.",
    images: mapProjectImages(project.project_images, project.cover_image, project.title),
    cover_url: null,
    published: project.published ?? false,
    show_on_home: project.show_on_home ?? false,
    project_technologies: technologies,
    project_files: projectFiles,
    project_services: projectServices,
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
        `)
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      if (!projectData) return null;

      // Fetch tools for this project
      const { data: projectTechRows, error: projectTechError } = await supabase
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
          const technology = row.technologies as ProjectTechnologySummary | ProjectTechnologySummary[] | null;
          return Array.isArray(technology) ? technology[0] : technology;
        })
        .filter((technology): technology is ProjectTechnologySummary => Boolean(technology?.id && technology?.name));

      const { data: projectFileRows, error: projectFilesError } = await supabase
        .from("project_files")
        .select("id, file_url, file_type, order_index")
        .eq("project_id", projectData.id)
        .order("order_index", { ascending: true });
      if (projectFilesError) {
        console.warn(`Could not load files for project ${projectData.id}`, projectFilesError);
      }

      const projectFiles = ((projectFileRows ?? []) as ProjectFileRow[]).filter((file) => Boolean(file.file_url));

      const { data: projectServiceRows, error: projectServicesError } = await supabase
        .from("project_services")
        .select(`
          service_id,
          services:service_id (
            id,
            title,
            description
          )
        `)
        .eq("project_id", projectData.id);

      if (projectServicesError) {
        console.warn(`Could not load services for project ${projectData.id}`, projectServicesError);
      }

      const projectServices = ((projectServiceRows ?? []) as Array<{ services: ServiceSummary | ServiceSummary[] | null }>)
        .map((row) => {
          const service = row.services as ServiceSummary | ServiceSummary[] | null;
          return Array.isArray(service) ? service[0] : service;
        })
        .filter((service): service is ServiceSummary => Boolean(service?.id && service?.title));

      return mapProject(projectData as RawProjectRow, technologies, projectFiles, projectServices);
    },
    enabled: !!slug,
  });
}
