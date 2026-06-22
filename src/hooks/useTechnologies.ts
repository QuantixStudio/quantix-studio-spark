import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { AdminTechnology } from "@/types/app";

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

export function useTechnologies() {
  return useQuery({
    queryKey: ["technologies", "public"],
    queryFn: async () => {
      const { data, error } = await untypedSupabase
        .from("technologies")
        .select("id, name, slug, description, created_at, logo_path")
        .order("name", { ascending: true });

      if (error) throw error;

      return ((data ?? []) as Array<Record<string, unknown>>)
        .map((row) => ({
          id: String(row.id),
          name: String(row.name ?? ""),
          slug: String(row.slug ?? ""),
          description: typeof row.description === "string" ? row.description : null,
          created_at: typeof row.created_at === "string" ? row.created_at : null,
          usage_count: 0,
          logo_path: typeof row.logo_path === "string" ? row.logo_path : null,
        }))
        .filter((technology) => Boolean(technology.logo_path)) satisfies AdminTechnology[];
    },
  });
}
