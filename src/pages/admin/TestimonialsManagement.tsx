import { useState } from "react";
import { useAdminTestimonials } from "@/hooks/useAdminTestimonials";
import TestimonialsTable from "@/components/admin/TestimonialsTable";
import TestimonialFormModal from "@/components/admin/TestimonialFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestimonialsManagement() {
  const { data: testimonials, isLoading } = useAdminTestimonials();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any | null>(null);

  const handleEdit = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer testimonials and reviews
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <TestimonialsTable
          testimonials={testimonials || []}
          onEdit={handleEdit}
        />
      )}

      <TestimonialFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        testimonial={selectedTestimonial}
      />
    </div>
  );
}
