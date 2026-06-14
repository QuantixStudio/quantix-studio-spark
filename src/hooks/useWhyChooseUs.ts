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

export interface WhyChooseUsItem {
  id: number | string;
  title: string;
  description: string;
  icon_name: string;
  order: number;
  created_at?: string;
}

export function useWhyChooseUs() {
  return useQuery({
    queryKey: ["why-choose-us"],
    queryFn: async () => {
      const { data, error } = await (supabase as unknown as UntypedSupabaseQuery)
        .from("why_choose_us")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        throw error;
      }

      return ((data ?? []) as Array<Record<string, unknown>>).map((row, index) => ({
        id:
          typeof row.id === "number" || typeof row.id === "string"
            ? row.id
            : index,
        title: String(row.title ?? ""),
        description: String(row.description ?? ""),
        icon_name: String(row.icon_name ?? "Zap"),
        order: Number(row.order ?? index + 1),
        created_at: typeof row.created_at === "string" ? row.created_at : undefined,
      })) satisfies WhyChooseUsItem[];
    },
  });
}
