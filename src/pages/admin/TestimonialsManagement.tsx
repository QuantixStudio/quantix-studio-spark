import { useState } from "react";
import { useAdminTestimonials } from "@/hooks/useAdminTestimonials";
import TestimonialsTable from "@/components/admin/TestimonialsTable";
import TestimonialFormModal from "@/components/admin/TestimonialFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Testimonial } from "@/types/app";

export default function TestimonialsManagement() {
  const { data: testimonials, isLoading } = useAdminTestimonials();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content management"
        title="Testimonials"
        description="Review social proof, keep avatars and ratings polished, and control what appears on the public site."
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
        }
      />

      {isLoading ? (
        <div className="admin-surface space-y-4 p-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-72 w-full" />
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
