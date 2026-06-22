import { useState } from "react";
import { Layers3 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import PortfolioReferenceFormModal from "@/components/admin/PortfolioReferenceFormModal";
import PortfolioReferenceTable from "@/components/admin/PortfolioReferenceTable";
import TestimonialFormModal from "@/components/admin/TestimonialFormModal";
import TestimonialsTable from "@/components/admin/TestimonialsTable";
import ToolFormModal from "@/components/admin/ToolFormModal";
import ToolsTable from "@/components/admin/ToolsTable";
import { AdminPageShell } from "@/components/shared/AdminPageShell";
import { StatePanel } from "@/components/shared/StatePanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminTestimonials } from "@/hooks/useAdminTestimonials";
import { usePortfolioTechnologies } from "@/hooks/usePortfolioSystem";
import { useTools } from "@/hooks/useTools";
import type { AdminTechnology, Testimonial, Tool } from "@/types/app";

type StackCollectionTab = "tools" | "technologies" | "testimonials";

const collectionTabs: Array<{
  value: StackCollectionTab;
  label: string;
  description: string;
  actionLabel: string;
}> = [
  {
    value: "tools",
    label: "Tools",
    description: "Manage the visual stack library used for logos, featured integrations, and storage-backed brand assets.",
    actionLabel: "Add Tool",
  },
  {
    value: "technologies",
    label: "Technologies",
    description: "Manage the reusable project stack taxonomy. Logo previews are matched from the Tools collection by slug or name.",
    actionLabel: "Add Technology",
  },
  {
    value: "testimonials",
    label: "Testimonials",
    description: "Manage social proof, avatars, and published quotes that support trust across the public site.",
    actionLabel: "Add Testimonial",
  },
];

function getValidTab(value: string | null): StackCollectionTab {
  return collectionTabs.some((tab) => tab.value === value)
    ? (value as StackCollectionTab)
    : "tools";
}

export default function ToolsManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isTechnologyModalOpen, setIsTechnologyModalOpen] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState<AdminTechnology | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const activeTab = getValidTab(searchParams.get("collection"));
  const tabMeta = collectionTabs.find((tab) => tab.value === activeTab) ?? collectionTabs[0];

  const toolsQuery = useTools();
  const technologiesQuery = usePortfolioTechnologies();
  const testimonialsQuery = useAdminTestimonials();

  const isLoading =
    activeTab === "tools"
      ? toolsQuery.isLoading
      : activeTab === "technologies"
        ? technologiesQuery.isLoading
        : testimonialsQuery.isLoading;

  const handleTabChange = (nextTab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("collection", nextTab);
    setSearchParams(params, { replace: true });
  };

  const handleAdd = () => {
    if (activeTab === "tools") {
      setSelectedTool(null);
      setIsToolModalOpen(true);
      return;
    }

    if (activeTab === "technologies") {
      setSelectedTechnology(null);
      setIsTechnologyModalOpen(true);
      return;
    }

    setSelectedTestimonial(null);
    setIsTestimonialModalOpen(true);
  };

  const body = activeTab === "tools" ? (
    toolsQuery.isError ? (
      <StatePanel
        title="Tools could not be loaded"
        description="The tools collection could not be fetched from Supabase for this stack library view."
      />
    ) : (
      <ToolsTable
        tools={toolsQuery.data || []}
        onEdit={(tool) => {
          setSelectedTool(tool);
          setIsToolModalOpen(true);
        }}
      />
    )
  ) : activeTab === "technologies" ? (
    technologiesQuery.isError ? (
      <StatePanel
        title="Technologies could not be loaded"
        description="The technology catalog could not be fetched from Supabase for this stack library view."
      />
    ) : (
      <PortfolioReferenceTable
        tab="technologies"
        items={technologiesQuery.data ?? []}
        onEdit={(item) => {
          setSelectedTechnology(item as AdminTechnology);
          setIsTechnologyModalOpen(true);
        }}
      />
    )
  ) : testimonialsQuery.isError ? (
    <StatePanel
      title="Testimonials could not be loaded"
      description="The testimonials collection could not be fetched from Supabase for this stack library view."
    />
  ) : (
    <TestimonialsTable
      testimonials={testimonialsQuery.data ?? []}
      onEdit={(testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsTestimonialModalOpen(true);
      }}
    />
  );

  return (
    <>
      <AdminPageShell
        eyebrow="Stack library"
        title="Stack Library"
        description={tabMeta.description}
        actionLabel={tabMeta.actionLabel}
        actionIcon={Layers3}
        onAction={handleAdd}
        isLoading={isLoading}
      >
        <div className="content-stack">
          <div className="admin-surface rounded-2xl p-3 sm:p-4">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="h-auto flex w-full flex-col gap-2 bg-transparent p-0 sm:flex-row sm:flex-wrap sm:justify-start">
                {collectionTabs.map((tab) => (
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

          {body}

          {activeTab === "technologies" ? (
            <div className="admin-surface rounded-2xl border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
              Logos for technologies are resolved from the <span className="font-medium text-foreground">Tools</span> collection.
              Keep matching `slug` or `name` values between the two collections so Build Stack cards show the correct storage image.
            </div>
          ) : null}
        </div>
      </AdminPageShell>

      <ToolFormModal
        isOpen={isToolModalOpen}
        onClose={() => {
          setIsToolModalOpen(false);
          setSelectedTool(null);
        }}
        tool={selectedTool}
      />

      <PortfolioReferenceFormModal
        isOpen={isTechnologyModalOpen}
        onClose={() => {
          setIsTechnologyModalOpen(false);
          setSelectedTechnology(null);
        }}
        tab="technologies"
        item={selectedTechnology}
      />

      <TestimonialFormModal
        isOpen={isTestimonialModalOpen}
        onClose={() => {
          setIsTestimonialModalOpen(false);
          setSelectedTestimonial(null);
        }}
        testimonial={selectedTestimonial}
      />
    </>
  );
}
