import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  feedback: string;
  avatar_url: string | null;
  rating: number | null;
  order_index: number;
  published: boolean;
  created_at: string;
}

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
      return data as Testimonial[];
    },
  });
};
