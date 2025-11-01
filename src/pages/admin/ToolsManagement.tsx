import { useState } from "react";
import { useTools } from "@/hooks/useTools";
import ToolsTable from "@/components/admin/ToolsTable";
import ToolFormModal from "@/components/admin/ToolFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ToolsManagement() {
  const { data: tools, isLoading } = useTools();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any | null>(null);

  const handleEdit = (tool: any) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tools</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tech stack tools
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tool
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
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
