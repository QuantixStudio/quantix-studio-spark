import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tool } from "@/types/app";

export type { Tool } from "@/types/app";

export const useTools = () => {
  return useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return (data ?? []) as Tool[];
    },
  });
};
