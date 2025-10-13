import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import ProjectsTable from "@/components/admin/ProjectsTable";
import ProjectFormModal from "@/components/admin/ProjectFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsManagement() {
  const { data: projects, isLoading } = useProjects(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
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
