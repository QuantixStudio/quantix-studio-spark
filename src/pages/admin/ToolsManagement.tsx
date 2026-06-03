import { useState } from "react";
import { useTools } from "@/hooks/useTools";
import ToolsTable from "@/components/admin/ToolsTable";
import ToolFormModal from "@/components/admin/ToolFormModal";
import { AdminPageShell } from "@/components/shared/AdminPageShell";
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
    <AdminPageShell
      title="Tools"
      description="Keep your featured stack clean, searchable, and visually consistent across portfolio and services."
      actionLabel="Add Tool"
      onAction={() => setIsModalOpen(true)}
      isLoading={isLoading}
    >
      <ToolsTable tools={tools || []} onEdit={handleEdit} />

      <ToolFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        tool={selectedTool}
      />
    </AdminPageShell>
  );
}
