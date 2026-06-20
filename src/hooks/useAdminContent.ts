import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { AdminContentItem, AdminService, ServiceIcon } from "@/types/app";

type UntypedSupabase = {
  from: (table: string) => {
    select: (columns: string) => {
      order: (
        column: string,
        options: { ascending: boolean },
      ) => Promise<{ data: unknown[] | null; error: unknown }>;
    };
  };
};

const untypedSupabase = supabase as unknown as UntypedSupabase;

export function useAdminServices() {
  return useQuery({
    queryKey: ["admin-content", "services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          id,
          title,
          description,
          order_index,
          published,
          updated_at,
          icon_id,
          service_icon:icon_id (
            id,
            name,
            icon_url
          )
        `)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return (data ?? []) as AdminService[];
    },
  });
}

export function useServiceIcons() {
  return useQuery({
    queryKey: ["admin-content", "service-icons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_icon")
        .select("id, name, icon_url")
        .order("name", { ascending: true });

      if (error) throw error;
      return (data ?? []) as Pick<ServiceIcon, "id" | "name" | "icon_url">[];
    },
  });
}

export function useAdminHowWeWork() {
  return useQuery({
    queryKey: ["admin-content", "how-we-work"],
    queryFn: async () => {
      const { data, error } = await untypedSupabase
        .from("how_we_work")
        .select("id, title, description, order, created_at")
        .order("order", { ascending: true });

      if (error) throw error;
      return (data ?? []) as AdminContentItem[];
    },
  });
}

export function useAdminWhyChooseUs() {
  return useQuery({
    queryKey: ["admin-content", "why-choose-us"],
    queryFn: async () => {
      const { data, error } = await untypedSupabase
        .from("why_choose_us")
        .select("id, title, description, order, created_at")
        .order("order", { ascending: true });

      if (error) throw error;
      return (data ?? []) as AdminContentItem[];
    },
  });
}
