import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useProfileModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      const isIncomplete = !data?.full_name || !data?.avatar_url;
      const hasSeenModal = localStorage.getItem(`profile-modal-seen-${user.id}`);

      if (isIncomplete && !hasSeenModal) {
        setIsFirstLogin(true);
        setIsOpen(true);
      }
    };

    checkProfile();
  }, [user]);

  const closeModal = () => {
    setIsOpen(false);
    if (user) {
      localStorage.setItem(`profile-modal-seen-${user.id}`, "true");
    }
  };

  return {
    isOpen,
    isFirstLogin,
    openModal: () => setIsOpen(true),
    closeModal,
  };
}
