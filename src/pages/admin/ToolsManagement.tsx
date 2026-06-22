import { useState } from "react";
import { Layers3 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import PortfolioReferenceFormModal from "@/components/admin/PortfolioReferenceFormModal";
import PortfolioReferenceTable from "@/components/admin/PortfolioReferenceTable";
import TestimonialFormModal from "@/components/admin/TestimonialFormModal";
import TestimonialsTable from "@/components/admin/TestimonialsTable";
import { AdminPageShell } from "@/components/shared/AdminPageShell";
import { StatePanel } from "@/components/shared/StatePanel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminTestimonials } from "@/hooks/useAdminTestimonials";
import { usePortfolioCategories, usePortfolioTechnologies } from "@/hooks/usePortfolioSystem";
import type { AdminProjectCategory, AdminTechnology, Testimonial } from "@/types/app";

type StackCollectionTab = "technologies" | "categories" | "testimonials";

const collectionTabs: Array<{
  value: StackCollectionTab;
  label: string;
  description: string;
  actionLabel: string;
}> = [
  {
    value: "technologies",
    label: "Technologies",
    description: "Manage the reusable project stack taxonomy and the storage-backed logos used across the homepage carousel and project build stack.",
    actionLabel: "Add Technology",
  },
  {
    value: "categories",
    label: "Categories",
    description: "Manage project categories used for organization, filtering, and public portfolio labeling.",
    actionLabel: "Add Category",
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
    : "technologies";
}

export default function ToolsManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTechnologyModalOpen, setIsTechnologyModalOpen] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState<AdminTechnology | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AdminProjectCategory | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const activeTab = getValidTab(searchParams.get("collection"));
  const tabMeta = collectionTabs.find((tab) => tab.value === activeTab) ?? collectionTabs[0];

  const technologiesQuery = usePortfolioTechnologies();
  const categoriesQuery = usePortfolioCategories();
  const testimonialsQuery = useAdminTestimonials();

  const isLoading =
    activeTab === "technologies"
      ? technologiesQuery.isLoading
      : activeTab === "categories"
        ? categoriesQuery.isLoading
        : testimonialsQuery.isLoading;

  const handleTabChange = (nextTab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("collection", nextTab);
    setSearchParams(params, { replace: true });
  };

  const handleAdd = () => {
    if (activeTab === "technologies") {
      setSelectedTechnology(null);
      setIsTechnologyModalOpen(true);
      return;
    }

    if (activeTab === "categories") {
      setSelectedCategory(null);
      setIsCategoryModalOpen(true);
      return;
    }

    setSelectedTestimonial(null);
    setIsTestimonialModalOpen(true);
  };

  const body = activeTab === "technologies" ? (
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
  ) : activeTab === "categories" ? (
    categoriesQuery.isError ? (
      <StatePanel
        title="Categories could not be loaded"
        description="The project category catalog could not be fetched from Supabase for this stack library view."
      />
    ) : (
      <PortfolioReferenceTable
        tab="categories"
        items={categoriesQuery.data ?? []}
        onEdit={(item) => {
          setSelectedCategory(item as AdminProjectCategory);
          setIsCategoryModalOpen(true);
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
              Technologies are now the single source of truth for the homepage stack carousel and project build stack.
              Each logo is stored in <span className="font-medium text-foreground">tools_logos</span> and saved directly on the technology record.
            </div>
          ) : null}
        </div>
      </AdminPageShell>

      <PortfolioReferenceFormModal
        isOpen={isTechnologyModalOpen}
        onClose={() => {
          setIsTechnologyModalOpen(false);
          setSelectedTechnology(null);
        }}
        tab="technologies"
        item={selectedTechnology}
      />

      <PortfolioReferenceFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setSelectedCategory(null);
        }}
        tab="categories"
        item={selectedCategory}
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
