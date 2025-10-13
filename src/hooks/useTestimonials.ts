import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  feedback: string;
  avatar_url: string | null;
  rating: number | null;
  order_index: number;
}

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
      return data as Testimonial[];
    },
  });
}
