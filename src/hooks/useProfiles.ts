import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { AdminProfile } from "@/types/app";

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const profilesQuery = supabase.from("profiles") as unknown as {
        select: (columns: string) => {
          order: (
            column: string,
            options: { ascending: boolean },
          ) => {
            order: (
              nextColumn: string,
              nextOptions: { ascending: boolean; nullsFirst?: boolean },
            ) => Promise<{ data: AdminProfile[] | null; error: Error | null }>;
          };
        };
      };

      const { data, error } = await profilesQuery
        .select(`
          id,
          email,
          full_name,
          avatar_url,
          bio,
          role,
          created_at,
          updated_at
        `)
        .order("created_at", { ascending: false })
        .order("full_name", { ascending: true, nullsFirst: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}
