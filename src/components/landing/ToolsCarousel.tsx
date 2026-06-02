import { useMemo } from "react";
import { useTools } from "@/hooks/useTools";
import { getToolLogoUrl } from "@/lib/toolStorageUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { StatePanel } from "@/components/shared/StatePanel";

export default function ToolsCarousel() {
  const { data: tools, isLoading } = useTools();

  // Filter featured tools and prepare logo URLs
  const featuredTools = useMemo(() => {
    if (!tools) return [];
    return tools
      .filter(tool => tool.is_featured)
      .map(tool => ({
        id: tool.id,
        name: tool.name,
        logoUrl: getToolLogoUrl(tool.logo_path),
      }));
  }, [tools]);

  // Duplicate array exactly 2x for seamless infinite loop
  const duplicatedTools = useMemo(() => {
    if (featuredTools.length === 0) return [];
    return [...featuredTools, ...featuredTools];
  }, [featuredTools]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex gap-8 items-center justify-center py-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[120px] w-[180px] rounded-2xl" />
        ))}
      </div>
    );
  }

  // Empty state
  if (featuredTools.length === 0) {
    return (
      <StatePanel
        title="No featured tools yet"
        description="Mark a few tools as featured in the admin area and they will appear here automatically."
      />
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Gradient fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent z-10 pointer-events-none" />

      {/* CSS-animated continuous scroll */}
      <div className="py-4">
        <div className="flex gap-8 items-center animate-scroll-left">
          {duplicatedTools.map((tool, index) => (
            <div
              key={`${tool.id}-${index}`}
              className="flex-shrink-0 w-[180px]"
            >
              <div className="media-hover-trigger bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 h-[120px] flex items-center justify-center overflow-hidden p-4">
                <img
                  src={tool.logoUrl || "/placeholder.svg"}
                  alt={`${tool.name} logo`}
                  className="media-hover-target h-full w-full object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
