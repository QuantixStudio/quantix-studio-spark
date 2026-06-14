import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Testimonial } from "@/types/app";

export type { Testimonial } from "@/types/app";

export const useAdminTestimonials = () => {
  return useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Testimonial[];
    },
  });
};
