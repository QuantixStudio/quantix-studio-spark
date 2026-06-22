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
  PortfolioSystemTab,
} from "@/types/app";

type ReferenceItem = AdminPortfolioStatus;

const tabs: Array<{
  value: PortfolioSystemTab;
  label: string;
  description: string;
  actionLabel: string;
}> = [
  {
    value: "statuses",
    label: "Statuses",
    description: "Manage workflow statuses used by projects and project tasks in the admin system.",
    actionLabel: "Add Status",
  },
];

const statusTabs: Array<{
  value: PortfolioStatusTab;
  label: string;
  actionLabel: string;
}> = [
  { value: "project-statuses", label: "Project Statuses", actionLabel: "Add Project Status" },
  { value: "task-statuses", label: "Task Statuses", actionLabel: "Add Task Status" },
];

function getValidTab(value: string | null): PortfolioSystemTab {
  return tabs.some((tab) => tab.value === value) ? (value as PortfolioSystemTab) : "statuses";
}

function getValidStatusTab(value: string | null): PortfolioStatusTab {
  return statusTabs.some((tab) => tab.value === value) ? (value as PortfolioStatusTab) : "project-statuses";
}

export default function PortfolioSystemManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<ReferenceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeTab = getValidTab(searchParams.get("tab"));
  const activeStatusTab = getValidStatusTab(searchParams.get("statusTab"));
  const tabMeta = tabs.find((tab) => tab.value === activeTab) ?? tabs[0];
  const statusMeta = statusTabs.find((tab) => tab.value === activeStatusTab) ?? statusTabs[0];

  const projectStatusesQuery = usePortfolioProjectStatuses();
  const taskStatusesQuery = usePortfolioTaskStatuses();

  const isLoading = activeStatusTab === "project-statuses"
    ? projectStatusesQuery.isLoading
    : taskStatusesQuery.isLoading;

  const actionLabel = activeTab === "statuses" ? statusMeta.actionLabel : tabMeta.actionLabel;

  const handleTabChange = (nextTab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", nextTab);
    if (nextTab !== "statuses") {
      params.delete("statusTab");
    } else if (!params.get("statusTab")) {
      params.set("statusTab", "project-statuses");
    }
    setSearchParams(params, { replace: true });
  };

  const handleStatusTabChange = (nextStatusTab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", "statuses");
    params.set("statusTab", nextStatusTab);
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
      </div>
    );
  })();

  return (
    <>
      <AdminPageShell
        eyebrow="Portfolio system"
        title="Portfolio System"
        description={tabMeta.description}
        actionLabel={actionLabel}
        actionIcon={FolderTree}
        onAction={handleAdd}
        isLoading={isLoading}
      >
        <div className="content-stack">
          <div className="admin-surface rounded-2xl p-3 sm:p-4">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="h-auto flex w-full flex-col gap-2 bg-transparent p-0 sm:flex-row sm:flex-wrap sm:justify-start">
                {tabs.map((tab) => (
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
        tab={activeTab === "statuses" ? activeStatusTab : activeTab}
        item={selectedItem}
      />
    </>
  );
}
