import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Testimonial } from "@/hooks/useAdminTestimonials";
import { deleteTestimonialAvatar, getTestimonialAvatarUrl } from "@/lib/testimonialStorageUtils";
import { format } from "date-fns";

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
}

export default function TestimonialsTable({ testimonials, onEdit }: TestimonialsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

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
      toast.error("Failed to delete testimonial");
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
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">
          No testimonials found. Add your first testimonial to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
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
                  {testimonial.avatar_url ? (
                    <img
                      src={getTestimonialAvatarUrl(testimonial.avatar_url) || ""}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{testimonial.name}</TableCell>
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
                    <Badge variant="default" className="bg-green-500">Published</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(testimonial.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(testimonial.id)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(testimonial.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
