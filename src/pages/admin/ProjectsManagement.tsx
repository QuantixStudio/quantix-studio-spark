import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import ProjectsTable from "@/components/admin/ProjectsTable";
import ProjectFormModal from "@/components/admin/ProjectFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content management"
        title="Projects"
        description="Manage your portfolio case studies, featured placements, images, and tool relationships."
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
        }
      />

      {isLoading ? (
        <div className="admin-surface space-y-4 p-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        <ProjectsTable projects={projects || []} onEdit={handleEdit} />
      )}

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        project={selectedProject}
      />
    </div>
  );
}
