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
  project_tools: Tool[];
}

export type EditableProject = ProjectWithTools;
export type AuthActionResult = { error: AuthError | null };
