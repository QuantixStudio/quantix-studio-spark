import type { AuthError } from "@supabase/supabase-js";

import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type ProjectCategory = Tables<"project_category">;
export type ProjectCategorySummary = Pick<ProjectCategory, "id" | "name" | "description">;
export interface ProjectStatusSummary {
  id: string;
  label: string | null;
  color: string | null;
  order_index: number | null;
}
export interface ClientSummary {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  status: string | null;
}
export interface TaskStatusSummary {
  id: string;
  label: string | null;
  color: string | null;
  order_index: number | null;
}
export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website_url: string | null;
  logo_path: string | null;
  is_featured: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}
export interface AdminProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}
export type Testimonial = Tables<"testimonials">;
export type ServiceIcon = Tables<"service_icon">;
export type UserRole = Tables<"user_roles">;

export interface ServiceWithIcon extends Tables<"services"> {
  service_icon: Pick<ServiceIcon, "id" | "name" | "icon_url"> | null;
}

export type ContentTab = "services" | "how-we-work" | "why-choose-us";
export type PortfolioSystemTab = "technologies" | "categories" | "statuses";
export type PortfolioStatusTab = "project-statuses" | "task-statuses";

export interface AdminService {
  id: string;
  title: string | null;
  description: string | null;
  order_index: number | null;
  published: boolean | null;
  updated_at: string | null;
  icon_id: string | null;
  service_icon: Pick<ServiceIcon, "id" | "name" | "icon_url"> | null;
}

export interface AdminContentItem {
  id: string;
  title: string | null;
  description: string | null;
  order: number | null;
  created_at: string | null;
}

export interface AdminTechnology {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string | null;
  usage_count: number;
  logo_path?: string | null;
}

export interface AdminProjectCategory {
  id: string;
  name: string;
  description: string | null;
  order_index: number | null;
  usage_count: number;
}

export interface AdminPortfolioStatus {
  id: string;
  label: string | null;
  color: string | null;
  order_index: number | null;
  usage_count: number;
}

export interface ProjectImage {
  id?: string;
  url: string;
  alt: string;
  is_main: boolean;
  order: number;
  file_path?: string | null;
  file?: File;
}

export interface ProjectFileSummary {
  id: string;
  file_url: string;
  file_type: string | null;
  order_index: number | null;
  created_at: string | null;
}

export interface ProjectServiceSummary {
  id: string;
  title: string;
  description: string | null;
}

export interface ProjectTaskSummary {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  created_at: string | null;
  status: string | null;
  task_status?: TaskStatusSummary | null;
}

export interface ProjectTechnologySummary {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  logo_path?: string | null;
}

export type ProjectRow = Tables<"projects">;

export interface RawProjectWithCategory extends Omit<ProjectRow, "images"> {
  status: string | null;
  client_id: string | null;
  cover_image_id: string | null;
  project_category: ProjectCategorySummary | null;
  project_status?: ProjectStatusSummary | null;
  client?: ClientSummary | null;
  images?: ProjectImage[] | null;
  project_tasks?: ProjectTaskSummary[];
  project_files?: ProjectFileSummary[];
  project_services?: ProjectServiceSummary[];
}

export interface ProjectWithTools
  extends Omit<ProjectRow, "images" | "published" | "show_on_home"> {
  status: string | null;
  client_id: string | null;
  cover_image_id: string | null;
  images: ProjectImage[] | null;
  published: boolean;
  show_on_home: boolean;
  project_category: ProjectCategorySummary | null;
  project_status?: ProjectStatusSummary | null;
  client?: ClientSummary | null;
  project_technologies: ProjectTechnologySummary[];
  project_tools: Tool[];
  project_files: ProjectFileSummary[];
  project_services: ProjectServiceSummary[];
  project_tasks: ProjectTaskSummary[];
}

export type EditableProject = ProjectWithTools;
export type AuthActionResult = { error: AuthError | null };
