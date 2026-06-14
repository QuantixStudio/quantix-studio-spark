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
  id: string;
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

      return ((data ?? []) as Array<Record<string, unknown>>).map((row, index) => ({
        id: typeof row.id === "string" ? row.id : `how-we-work-${index}`,
        title: String(row.title ?? ""),
        subtitle: null,
        description: String(row.description ?? ""),
        icon_name:
          Number(row.order ?? index + 1) === 1
            ? "Search"
            : Number(row.order ?? index + 1) === 2
              ? "Palette"
              : Number(row.order ?? index + 1) === 3
                ? "Workflow"
                : "Rocket",
        order: Number(row.order ?? index + 1),
        created_at: String(row.created_at ?? ""),
      })) satisfies HowWeWorkStep[];
    },
  });
}
