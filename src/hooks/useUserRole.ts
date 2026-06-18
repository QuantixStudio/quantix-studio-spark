import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "manager" | "client";

export function useUserRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) {
        return {
          role: null as AppRole | null,
          isAdmin: false,
          canAccessAdmin: false,
        };
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
        .returns<{ role: AppRole }>();

      if (error) throw error;

      const role = data?.role ?? null;
      const isAdmin = role === "admin";
      const canAccessAdmin = role === "admin" || role === "manager";

      return { role, isAdmin, canAccessAdmin };
    },
    enabled: !!user,
  });
}
