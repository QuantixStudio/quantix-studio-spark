import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import ProjectsTable from "@/components/admin/ProjectsTable";
import ProjectFormModal from "@/components/admin/ProjectFormModal";
import { AdminPageShell } from "@/components/shared/AdminPageShell";
import type { EditableProject } from "@/types/app";

export default function ProjectsManagement() {
  const { data: projects, isLoading } = useProjects(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<EditableProject | null>(null);

  const handleEdit = (project: EditableProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <AdminPageShell
      title="Projects"
      description="Manage your portfolio case studies, featured placements, images, and tool relationships."
      actionLabel="Add Project"
      onAction={() => setIsModalOpen(true)}
      isLoading={isLoading}
    >
      <ProjectsTable projects={projects || []} onEdit={handleEdit} />

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        project={selectedProject}
      />
    </AdminPageShell>
  );
}
