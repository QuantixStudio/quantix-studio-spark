import type {
  ProjectImage,
  ProjectWithTools,
  RawProjectWithCategory,
  Tool,
} from "@/types/app";

function isProjectImage(value: unknown): value is ProjectImage {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const maybeImage = value as Record<string, unknown>;

  return (
    typeof maybeImage.url === "string" &&
    typeof maybeImage.alt === "string" &&
    typeof maybeImage.is_main === "boolean" &&
    typeof maybeImage.order === "number"
  );
}

export function getProjectImages(
  images: unknown,
  fallback?: { coverUrl: string | null; title: string },
): ProjectImage[] {
  if (Array.isArray(images)) {
    const parsedImages = images
      .filter(isProjectImage)
      .map((image) => ({
        id: typeof (image as { id?: unknown }).id === "string" ? (image as { id?: string }).id : undefined,
        url: image.url,
        alt: image.alt,
        is_main: image.is_main,
        order: image.order,
        file_path:
          typeof (image as { file_path?: unknown }).file_path === "string" ||
          (image as { file_path?: unknown }).file_path === null
            ? ((image as { file_path?: string | null }).file_path ?? null)
            : null,
      }))
      .sort((left, right) => left.order - right.order);

    if (parsedImages.length > 0) {
      if (!parsedImages.some((image) => image.is_main)) {
        parsedImages[0].is_main = true;
      }

      return parsedImages;
    }
  }

  if (fallback?.coverUrl) {
    return [
      {
        id: undefined,
        url: fallback.coverUrl,
        alt: fallback.title,
        is_main: true,
        order: 0,
        file_path: null,
      },
    ];
  }

  return [];
}

export function serializeProjectImages(images: ProjectImage[]) {
  return images.map((image) => ({
    id: image.id,
    url: image.url,
    alt: image.alt,
    is_main: image.is_main,
    order: image.order,
    file_path: image.file_path ?? null,
  }));
}

export function getMainProjectImageUrl(project: {
  images: ProjectImage[] | null;
  cover_url: string | null;
}): string | null {
  const images = project.images ?? [];

  return images.find((image) => image.is_main)?.url ?? images[0]?.url ?? project.cover_url;
}

export function mapProjectWithTools(
  project: RawProjectWithCategory,
  projectTools: Tool[],
): ProjectWithTools {
  return {
    ...project,
    images: getProjectImages(project.images, {
      coverUrl: project.cover_url,
      title: project.title,
    }),
    published: project.published ?? false,
    show_on_home: project.show_on_home ?? false,
    status: project.status ?? null,
    client_id: project.client_id ?? null,
    cover_image_id: project.cover_image_id ?? null,
    order_index: project.order_index ?? null,
    project_category: project.project_category,
    project_status: project.project_status ?? null,
    client: project.client ?? null,
    project_technologies: projectTools.map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
    })),
    project_tools: projectTools,
    project_files: project.project_files ?? [],
    project_services: project.project_services ?? [],
    project_tasks: project.project_tasks ?? [],
  };
}
