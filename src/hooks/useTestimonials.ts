import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Testimonial } from "@/types/app";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return (data ?? []) as Testimonial[];
    },
  });
}
