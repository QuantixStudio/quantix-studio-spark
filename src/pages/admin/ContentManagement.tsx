import { useState } from "react";
import { FileStack } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import ContentItemFormModal from "@/components/admin/ContentItemFormModal";
import ContentItemsTable from "@/components/admin/ContentItemsTable";
import ServiceFormModal from "@/components/admin/ServiceFormModal";
import ServicesTable from "@/components/admin/ServicesTable";
import { AdminPageShell } from "@/components/shared/AdminPageShell";
import { StatePanel } from "@/components/shared/StatePanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminHowWeWork,
  useAdminServices,
  useAdminWhyChooseUs,
  useServiceIcons,
} from "@/hooks/useAdminContent";
import type { AdminContentItem, AdminService, ContentTab } from "@/types/app";

const tabs: Array<{
  value: ContentTab;
  label: string;
  description: string;
  actionLabel: string;
}> = [
  {
    value: "services",
    label: "Services",
    description: "Manage service cards, visibility, ordering, and icon assignments for the public Services section.",
    actionLabel: "Add Service",
  },
  {
    value: "how-we-work",
    label: "How We Work",
    description: "Control the process steps that explain how the team works on the landing page.",
    actionLabel: "Add Step",
  },
  {
    value: "why-choose-us",
    label: "Why Choose Us",
    description: "Control the value-prop cards that reinforce trust and positioning on the landing page.",
    actionLabel: "Add Item",
  },
];

function getValidTab(value: string | null): ContentTab {
  return tabs.some((tab) => tab.value === value) ? (value as ContentTab) : "services";
}

export default function ContentManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState<AdminService | null>(null);
  const [selectedItem, setSelectedItem] = useState<AdminContentItem | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [contentItemModalOpen, setContentItemModalOpen] = useState(false);

  const activeTab = getValidTab(searchParams.get("tab"));
  const tabMeta = tabs.find((tab) => tab.value === activeTab) ?? tabs[0];

  const servicesQuery = useAdminServices();
  const serviceIconsQuery = useServiceIcons();
  const howWeWorkQuery = useAdminHowWeWork();
  const whyChooseUsQuery = useAdminWhyChooseUs();

  const isLoading = activeTab === "services"
    ? servicesQuery.isLoading || serviceIconsQuery.isLoading
    : activeTab === "how-we-work"
      ? howWeWorkQuery.isLoading
      : whyChooseUsQuery.isLoading;

  const handleTabChange = (nextTab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", nextTab);
    setSearchParams(params, { replace: true });
  };

  const handleAdd = () => {
    if (activeTab === "services") {
      setSelectedService(null);
      setServiceModalOpen(true);
      return;
    }

    setSelectedItem(null);
    setContentItemModalOpen(true);
  };

  const contentBody = (() => {
    if (activeTab === "services") {
      if (servicesQuery.isError || serviceIconsQuery.isError) {
        return (
          <StatePanel
            title="Services could not be loaded"
            description="The Services tab hit a Supabase error. Refresh or retry once the content source is available again."
          />
        );
      }

      return (
        <ServicesTable
          services={servicesQuery.data ?? []}
          onEdit={(service) => {
            setSelectedService(service);
            setServiceModalOpen(true);
          }}
        />
      );
    }

    if (activeTab === "how-we-work") {
      if (howWeWorkQuery.isError) {
        return (
          <StatePanel
            title="How We Work could not be loaded"
            description="The process-step content could not be fetched from Supabase for this tab."
          />
        );
      }

      return (
        <ContentItemsTable
          tab="how-we-work"
          items={howWeWorkQuery.data ?? []}
          onEdit={(item) => {
            setSelectedItem(item);
            setContentItemModalOpen(true);
          }}
        />
      );
    }

    if (whyChooseUsQuery.isError) {
      return (
        <StatePanel
          title="Why Choose Us could not be loaded"
          description="The value-prop content could not be fetched from Supabase for this tab."
        />
      );
    }

    return (
      <ContentItemsTable
        tab="why-choose-us"
        items={whyChooseUsQuery.data ?? []}
        onEdit={(item) => {
          setSelectedItem(item);
          setContentItemModalOpen(true);
        }}
      />
    );
  })();

  return (
    <>
      <AdminPageShell
        eyebrow="Content hub"
        title="Content"
        description={tabMeta.description}
        actionLabel={tabMeta.actionLabel}
        actionIcon={FileStack}
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

      <ServiceFormModal
        isOpen={serviceModalOpen}
        onClose={() => {
          setServiceModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        icons={serviceIconsQuery.data ?? []}
      />

      <ContentItemFormModal
        isOpen={contentItemModalOpen}
        onClose={() => {
          setContentItemModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        tab={activeTab === "services" ? "how-we-work" : activeTab}
      />
    </>
  );
}
