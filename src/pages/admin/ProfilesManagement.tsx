import { useState } from "react";

import ProfileFormModal from "@/components/admin/ProfileFormModal";
import ProfilesTable from "@/components/admin/ProfilesTable";
import { AdminPageShell } from "@/components/shared/AdminPageShell";
import { useProfiles } from "@/hooks/useProfiles";
import type { AdminProfile } from "@/types/app";

export default function ProfilesManagement() {
  const { data: profiles, isLoading } = useProfiles();
  const [selectedProfile, setSelectedProfile] = useState<AdminProfile | null>(null);

  return (
    <>
      <AdminPageShell
        eyebrow="Account management"
        title="Profiles"
        description="Review every profile stored in Supabase, including role, contact info, activity timestamps, and internal identifiers."
        isLoading={isLoading}
      >
        <ProfilesTable profiles={profiles || []} onEdit={setSelectedProfile} />
      </AdminPageShell>

      <ProfileFormModal
        isOpen={Boolean(selectedProfile)}
        onClose={() => setSelectedProfile(null)}
        profile={selectedProfile}
      />
    </>
  );
}
