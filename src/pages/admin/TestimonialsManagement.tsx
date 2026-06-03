import { useState } from "react";
import { useAdminTestimonials } from "@/hooks/useAdminTestimonials";
import TestimonialsTable from "@/components/admin/TestimonialsTable";
import TestimonialFormModal from "@/components/admin/TestimonialFormModal";
import { AdminPageShell } from "@/components/shared/AdminPageShell";
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
    <AdminPageShell
      title="Testimonials"
      description="Review social proof, keep avatars and ratings polished, and control what appears on the public site."
      actionLabel="Add Testimonial"
      onAction={() => setIsModalOpen(true)}
      isLoading={isLoading}
    >
      <TestimonialsTable
        testimonials={testimonials || []}
        onEdit={handleEdit}
      />

      <TestimonialFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        testimonial={selectedTestimonial}
      />
    </AdminPageShell>
  );
}
