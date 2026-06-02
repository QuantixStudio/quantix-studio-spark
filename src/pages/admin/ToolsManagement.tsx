import { useState } from "react";
import { useTools } from "@/hooks/useTools";
import ToolsTable from "@/components/admin/ToolsTable";
import ToolFormModal from "@/components/admin/ToolFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Tool } from "@/types/app";

export default function ToolsManagement() {
  const { data: tools, isLoading } = useTools();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content management"
        title="Tools"
        description="Keep your featured stack clean, searchable, and visually consistent across portfolio and services."
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tool
        </Button>
        }
      />

      {isLoading ? (
        <div className="admin-surface space-y-4 p-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        <ToolsTable tools={tools || []} onEdit={handleEdit} />
      )}

      <ToolFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        tool={selectedTool}
      />
    </div>
  );
}
