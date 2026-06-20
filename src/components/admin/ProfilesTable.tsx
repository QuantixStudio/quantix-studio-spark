import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatePanel } from "@/components/shared/StatePanel";
import { formatUiDate, formatUiDateTime } from "@/lib/date";
import type { AdminProfile } from "@/types/app";

interface ProfilesTableProps {
  profiles: AdminProfile[];
}

function getInitials(profile: AdminProfile) {
  const source = profile.full_name?.trim() || profile.email?.trim() || "User";

  return source
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRoleBadgeVariant(role: string | null) {
  switch (role) {
    case "admin":
      return "destructive";
    case "manager":
      return "default";
    default:
      return "secondary";
  }
}

function getDisplayName(profile: AdminProfile) {
  return profile.full_name?.trim() || "Unnamed user";
}

export default function ProfilesTable({ profiles }: ProfilesTableProps) {
  if (profiles.length === 0) {
    return (
      <StatePanel
        title="No profiles found"
        description="Profiles from Supabase will appear here so you can review account owners, roles, and contact details in one place."
      />
    );
  }

  return (
    <div className="table-shell">
      <Table className="min-w-[980px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Avatar</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Profile ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>
                <Avatar className="h-11 w-11 border border-white/10">
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={getDisplayName(profile)} />
                  ) : null}
                  <AvatarFallback className="bg-accent text-background">
                    {getInitials(profile)}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                <div className="space-y-1">
                  <p>{getDisplayName(profile)}</p>
                  <p className="text-xs text-muted-foreground">
                    {profile.email || "No email"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(profile.role)} className="rounded-[5px] px-4 py-1.5 text-sm font-semibold">
                  {profile.role || "unknown"}
                </Badge>
              </TableCell>
              <TableCell>
                {profile.bio ? (
                  <p className="max-w-sm text-sm text-muted-foreground line-clamp-2">
                    {profile.bio}
                  </p>
                ) : (
                  <span className="text-xs text-muted-foreground">No bio</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatUiDate(profile.created_at)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatUiDateTime(profile.updated_at)}
              </TableCell>
              <TableCell>
                <code className="text-xs text-muted-foreground">{profile.id}</code>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
