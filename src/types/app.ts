import type { AuthError } from "@supabase/supabase-js";

import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type ProjectCategory = Tables<"project_category">;
export type ProjectCategorySummary = Pick<ProjectCategory, "id" | "name" | "description">;
export type Tool = Tables<"tools">;
export type Testimonial = Tables<"testimonials">;
export type ServiceIcon = Tables<"service_icon">;
export type UserRole = Tables<"user_roles">;

export interface ServiceWithIcon extends Tables<"services"> {
  service_icon: Pick<ServiceIcon, "id" | "name" | "icon_url"> | null;
}

export interface ProjectImage {
  url: string;
  alt: string;
  is_main: boolean;
  order: number;
  file?: File;
}

export interface ProjectFileSummary {
  id: string;
  file_url: string;
  file_type: string | null;
  order_index: number | null;
}

export interface ProjectServiceSummary {
  id: string;
  title: string;
  description: string;
}

export interface ProjectTechnologySummary {
  id: string;
  name: string;
  description?: string | null;
}

export type ProjectRow = Tables<"projects">;

export interface RawProjectWithCategory extends ProjectRow {
  project_category: ProjectCategorySummary | null;
}

export interface ProjectWithTools
  extends Omit<ProjectRow, "images" | "published" | "show_on_home"> {
  images: ProjectImage[] | null;
  published: boolean;
  show_on_home: boolean;
  project_category: ProjectCategorySummary | null;
  project_technologies: ProjectTechnologySummary[];
  project_tools: Tool[];
  project_files: ProjectFileSummary[];
  project_services: ProjectServiceSummary[];
}

export type EditableProject = ProjectWithTools;
export type AuthActionResult = { error: AuthError | null };
