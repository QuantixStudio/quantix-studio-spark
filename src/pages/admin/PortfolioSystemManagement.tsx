import { useState } from "react";
import { FolderTree } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import PortfolioReferenceFormModal from "@/components/admin/PortfolioReferenceFormModal";
import PortfolioReferenceTable from "@/components/admin/PortfolioReferenceTable";
import { AdminPageShell } from "@/components/shared/AdminPageShell";
import { StatePanel } from "@/components/shared/StatePanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  usePortfolioProjectStatuses,
  usePortfolioTaskStatuses,
} from "@/hooks/usePortfolioSystem";
import type {
  AdminPortfolioStatus,
  PortfolioStatusTab,
} from "@/types/app";

type ReferenceItem = AdminPortfolioStatus;

const statusTabs: Array<{
  value: PortfolioStatusTab;
  label: string;
  actionLabel: string;
}> = [
  { value: "project-statuses", label: "Project Statuses", actionLabel: "Add Project Status" },
  { value: "task-statuses", label: "Task Statuses", actionLabel: "Add Task Status" },
];

function getValidStatusTab(value: string | null): PortfolioStatusTab {
  return statusTabs.some((tab) => tab.value === value) ? (value as PortfolioStatusTab) : "project-statuses";
}

export default function PortfolioSystemManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<ReferenceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeStatusTab = getValidStatusTab(
    searchParams.get("statusTab") ?? searchParams.get("tab"),
  );
  const statusMeta = statusTabs.find((tab) => tab.value === activeStatusTab) ?? statusTabs[0];

  const projectStatusesQuery = usePortfolioProjectStatuses();
  const taskStatusesQuery = usePortfolioTaskStatuses();

  const isLoading = activeStatusTab === "project-statuses"
    ? projectStatusesQuery.isLoading
    : taskStatusesQuery.isLoading;

  const handleStatusTabChange = (nextStatusTab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("statusTab", nextStatusTab);
    params.delete("tab");
    setSearchParams(params, { replace: true });
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const contentBody = (() => {
    const statusBody = activeStatusTab === "project-statuses"
      ? projectStatusesQuery
      : taskStatusesQuery;

    return (
      <>
        {statusBody.isError ? (
          <StatePanel
            title="Statuses could not be loaded"
            description="The selected status catalog could not be fetched from Supabase for this tab."
          />
        ) : (
          <PortfolioReferenceTable
            tab={activeStatusTab}
            items={statusBody.data ?? []}
            onEdit={(item) => {
              setSelectedItem(item);
              setIsModalOpen(true);
            }}
          />
        )}
      </>
    );
  })();

  return (
    <>
      <AdminPageShell
        eyebrow="Portfolio system"
        title="Portfolio System"
        description="Manage workflow statuses used by projects and project tasks in the admin system."
        actionLabel={statusMeta.actionLabel}
        actionIcon={FolderTree}
        onAction={handleAdd}
        isLoading={isLoading}
      >
        <div className="content-stack">
          <div className="admin-surface rounded-2xl p-3 sm:p-4">
            <Tabs value={activeStatusTab} onValueChange={handleStatusTabChange}>
              <TabsList className="h-auto flex w-full flex-col gap-2 bg-transparent p-0 sm:flex-row sm:flex-wrap sm:justify-start">
                {statusTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="w-full rounded-2xl border border-border/70 bg-background/40 px-4 py-3 text-left data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none sm:w-auto"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {contentBody}
        </div>
      </AdminPageShell>

      <PortfolioReferenceFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        tab={activeStatusTab}
        item={selectedItem}
      />
    </>
  );
}
