import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconGroupBadge } from "@/components/shared/IconGroupBadge";
import { RowActionsMenu } from "@/components/shared/RowActionsMenu";
import { StatePanel } from "@/components/shared/StatePanel";
import { formatUiDateTime } from "@/lib/date";
import { getErrorMessage } from "@/lib/errorUtils";
import type { AdminService } from "@/types/app";

interface ServicesTableProps {
  services: AdminService[];
  onEdit: (service: AdminService) => void;
}

function renderServiceIcon(service: AdminService) {
  if (service.service_icon?.icon_url) {
    return (
      <IconGroupBadge>
        <img
          src={service.service_icon.icon_url}
          alt={service.service_icon.name}
          className="icon-group-badge-icon h-10 w-10 object-contain"
        />
      </IconGroupBadge>
    );
  }

  if (service.service_icon?.name) {
    const iconLibrary = LucideIcons as unknown as Record<string, LucideIcon>;
    const Icon = iconLibrary[service.service_icon.name];
    return Icon ? <IconGroupBadge icon={Icon} /> : null;
  }

  return <span className="text-xs text-muted-foreground">No icon</span>;
}

export default function ServicesTable({ services, onEdit }: ServicesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const adminStatusBadgeClassName = "rounded-[5px] px-5 py-1.5 text-sm font-semibold";

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from("services").delete().eq("id", deleteId);
      if (error) throw error;

      toast.success("Service deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-content", "services"] });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete service"));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (services.length === 0) {
    return (
      <StatePanel
        title="No services yet"
        description="Add service cards here to populate the public Services section with the right copy, icon, order, and visibility."
      />
    );
  }

  return (
    <>
      <div className="table-shell">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{renderServiceIcon(service)}</TableCell>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <p>{service.title || "Untitled service"}</p>
                    <p className="max-w-xl text-xs text-muted-foreground line-clamp-2">
                      {service.description || "No description"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {service.published ? (
                    <Badge variant="default" className={`${adminStatusBadgeClassName} bg-green-500`}>Published</Badge>
                  ) : (
                    <Badge variant="secondary" className={adminStatusBadgeClassName}>Draft</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{service.order_index ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatUiDateTime(service.updated_at)}</TableCell>
                <TableCell>
                  <RowActionsMenu onEdit={() => onEdit(service)} onDelete={() => setDeleteId(service.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the service card from the admin hub and the landing-page content source.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
