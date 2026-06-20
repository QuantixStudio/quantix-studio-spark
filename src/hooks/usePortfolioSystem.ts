import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type {
  AdminPortfolioStatus,
  AdminProjectCategory,
  AdminTechnology,
} from "@/types/app";

type UntypedSupabase = {
  from: (table: string) => {
    select: (columns: string) => {
      order: (
        column: string,
        options?: { ascending?: boolean },
      ) => Promise<{ data: unknown[] | null; error: unknown }>;
    };
  };
};

const untypedSupabase = supabase as unknown as UntypedSupabase;

export function usePortfolioTechnologies() {
  return useQuery({
    queryKey: ["portfolio-system", "technologies"],
    queryFn: async () => {
      const [{ data: technologyRows, error: technologyError }, { data: projectTechnologyRows, error: projectTechnologyError }] =
        await Promise.all([
          untypedSupabase.from("technologies").select("id, name, slug, description, created_at").order("name", { ascending: true }),
          untypedSupabase.from("project_technologies").select("technology_id").order("technology_id", { ascending: true }),
        ]);

      if (technologyError) throw technologyError;
      if (projectTechnologyError) throw projectTechnologyError;

      const usageMap = new Map<string, number>();

      for (const row of (projectTechnologyRows ?? []) as Array<{ technology_id?: string | null }>) {
        const technologyId = row.technology_id;
        if (!technologyId) continue;
        usageMap.set(technologyId, (usageMap.get(technologyId) ?? 0) + 1);
      }

      return ((technologyRows ?? []) as Array<Record<string, unknown>>).map((row) => ({
        id: String(row.id),
        name: String(row.name ?? ""),
        slug: String(row.slug ?? ""),
        description: typeof row.description === "string" ? row.description : null,
        created_at: typeof row.created_at === "string" ? row.created_at : null,
        usage_count: usageMap.get(String(row.id)) ?? 0,
      })) satisfies AdminTechnology[];
    },
  });
}

export function usePortfolioCategories() {
  return useQuery({
    queryKey: ["portfolio-system", "categories"],
    queryFn: async () => {
      const [{ data: categoryRows, error: categoryError }, { data: projectRows, error: projectError }] = await Promise.all([
        supabase.from("project_category").select("id, name, description, order_index").order("order_index", { ascending: true }),
        untypedSupabase.from("projects").select("category_id").order("category_id", { ascending: true }),
      ]);

      if (categoryError) throw categoryError;
      if (projectError) throw projectError;

      const usageMap = new Map<string, number>();

      for (const row of (projectRows ?? []) as Array<{ category_id?: string | null }>) {
        const categoryId = row.category_id;
        if (!categoryId) continue;
        usageMap.set(categoryId, (usageMap.get(categoryId) ?? 0) + 1);
      }

      return ((categoryRows ?? []) as Array<Record<string, unknown>>).map((row) => ({
        id: String(row.id),
        name: String(row.name ?? ""),
        description: typeof row.description === "string" ? row.description : null,
        order_index: typeof row.order_index === "number" ? row.order_index : null,
        usage_count: usageMap.get(String(row.id)) ?? 0,
      })) satisfies AdminProjectCategory[];
    },
  });
}

function createStatusesHook(
  queryKey: readonly ["portfolio-system", "project-statuses"] | readonly ["portfolio-system", "task-statuses"],
  sourceTable: "project_status" | "task_status",
  relatedTable: "projects" | "project_tasks",
) {
  return () =>
    useQuery({
      queryKey: [...queryKey],
      queryFn: async () => {
        const [{ data: statusRows, error: statusError }, { data: relatedRows, error: relatedError }] = await Promise.all([
          untypedSupabase.from(sourceTable).select("id, label, color, order_index").order("order_index", { ascending: true }),
          untypedSupabase.from(relatedTable).select("status").order("status", { ascending: true }),
        ]);

        if (statusError) throw statusError;
        if (relatedError) throw relatedError;

        const usageMap = new Map<string, number>();

        for (const row of (relatedRows ?? []) as Array<{ status?: string | null }>) {
          const statusId = row.status;
          if (!statusId) continue;
          usageMap.set(statusId, (usageMap.get(statusId) ?? 0) + 1);
        }

        return ((statusRows ?? []) as Array<Record<string, unknown>>).map((row) => ({
          id: String(row.id),
          label: typeof row.label === "string" ? row.label : null,
          color: typeof row.color === "string" ? row.color : null,
          order_index: typeof row.order_index === "number" ? row.order_index : null,
          usage_count: usageMap.get(String(row.id)) ?? 0,
        })) satisfies AdminPortfolioStatus[];
      },
    });
}

export const usePortfolioProjectStatuses = createStatusesHook(
  ["portfolio-system", "project-statuses"],
  "project_status",
  "projects",
);

export const usePortfolioTaskStatuses = createStatusesHook(
  ["portfolio-system", "task-statuses"],
  "task_status",
  "project_tasks",
);
