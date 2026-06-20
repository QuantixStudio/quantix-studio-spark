import ProfilesTable from "@/components/admin/ProfilesTable";
import { AdminPageShell } from "@/components/shared/AdminPageShell";
import { useProfiles } from "@/hooks/useProfiles";

export default function ProfilesManagement() {
  const { data: profiles, isLoading } = useProfiles();

  return (
    <AdminPageShell
      eyebrow="Account management"
      title="Profiles"
      description="Review every profile stored in Supabase, including role, contact info, activity timestamps, and internal identifiers."
      isLoading={isLoading}
    >
      <ProfilesTable profiles={profiles || []} />
    </AdminPageShell>
  );
}
