import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ServiceIcon {
  id: string;
  name: string;
  icon_url: string | null;
}

interface Service {
  id: string;
  title: string;
  description: string;
  order_index: number;
  published: boolean;
  service_icon: ServiceIcon | null;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          service_icon:icon_id (
            id,
            name,
            icon_url
          )
        `)
        .eq("published", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Service[];
    },
  });
}
