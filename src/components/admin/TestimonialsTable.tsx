import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { getErrorMessage } from "@/lib/errorUtils";
import { formatUiDate } from "@/lib/date";
import { deleteTestimonialAvatar, getTestimonialAvatarUrl } from "@/lib/testimonialStorageUtils";
import { StatePanel } from "@/components/shared/StatePanel";
import { RowActionsMenu } from "@/components/shared/RowActionsMenu";
import type { Testimonial } from "@/types/app";

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
}

export default function TestimonialsTable({ testimonials, onEdit }: TestimonialsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const adminStatusBadgeClassName = "rounded-[5px] px-5 py-1.5 text-sm font-semibold";

  const handleEdit = async (testimonialId: string) => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("id", testimonialId)
      .single();

    if (error) {
      toast.error("Failed to fetch testimonial details");
      return;
    }

    onEdit(data as Testimonial);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const testimonial = testimonials.find((t) => t.id === deleteId);

      // Delete avatar from storage if exists
      if (testimonial?.avatar_url) {
        await deleteTestimonialAvatar(testimonial.avatar_url);
      }

      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("Testimonial deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(getErrorMessage(error, "Failed to delete testimonial"));
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const renderRating = (rating: number | null) => {
    if (!rating) return <span className="text-xs text-muted-foreground">No rating</span>;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  if (testimonials.length === 0) {
    return (
      <StatePanel
        title="No testimonials yet"
        description="Add social proof with customer feedback, ratings, and avatars so the landing page feels trustworthy and complete."
      />
    );
  }

  return (
    <>
      <div className="table-shell">
        <Table className="min-w-[780px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
              <TableCell>
                <Avatar className="h-12 w-12 border border-white/10 bg-white/[0.03]">
                  {testimonial.avatar_url ? (
                    <AvatarImage
                      src={getTestimonialAvatarUrl(testimonial.avatar_url) || ""}
                      alt={testimonial.name}
                      className="object-cover object-center"
                    />
                  ) : null}
                  <AvatarFallback className="bg-accent text-background">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <p>{testimonial.name}</p>
                    <p className="max-w-xs text-xs text-muted-foreground line-clamp-2">{testimonial.feedback}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {testimonial.company || (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {testimonial.position || (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{renderRating(testimonial.rating)}</TableCell>
                <TableCell>
                  {testimonial.published ? (
                    <Badge variant="default" className={`${adminStatusBadgeClassName} bg-green-500`}>Published</Badge>
                  ) : (
                    <Badge variant="secondary" className={adminStatusBadgeClassName}>Draft</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatUiDate(testimonial.created_at)}
                </TableCell>
                <TableCell>
                  <RowActionsMenu
                    onEdit={() => handleEdit(testimonial.id)}
                    onDelete={() => setDeleteId(testimonial.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
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
