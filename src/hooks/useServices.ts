import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string;
  icon_url: string | null;
  icon_name: string | null;
  order_index: number;
  published: boolean;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("published", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Service[];
    },
  });
}
