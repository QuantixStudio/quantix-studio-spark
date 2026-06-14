import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type UntypedSupabaseQuery = {
  from: (table: string) => {
    select: (columns: string) => {
      order: (
        column: string,
        options: { ascending: boolean },
      ) => Promise<{ data: unknown[] | null; error: unknown }>;
    };
  };
};

export interface HowWeWorkStep {
  id: number;
  title: string;
  subtitle: string | null;
  description: string;
  icon_name: string;
  order: number;
  created_at: string;
}

export function useHowWeWork() {
  return useQuery({
    queryKey: ["how-we-work"],
    queryFn: async () => {
      const { data, error } = await (supabase as unknown as UntypedSupabaseQuery)
        .from("how_we_work")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        throw error;
      }

      return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
        id: Number(row.id),
        title: String(row.title ?? ""),
        subtitle: null,
        description: String(row.description ?? ""),
        icon_name:
          Number(row.order ?? 0) === 1
            ? "Search"
            : Number(row.order ?? 0) === 2
              ? "Palette"
              : Number(row.order ?? 0) === 3
                ? "Workflow"
                : "Rocket",
        order: Number(row.order ?? 0),
        created_at: String(row.created_at ?? ""),
      })) satisfies HowWeWorkStep[];
    },
  });
}
