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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-8 py-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[112px] w-[208px] rounded-[28px]" />
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
    <div className="marquee-viewport relative w-full py-4">
      <div className="marquee-track">
        {[0, 1].map((groupIndex) => (
          <div
            key={groupIndex}
            className="marquee-group"
            aria-hidden={groupIndex === 1}
          >
            {featuredTools.map((tool) => (
              <div key={`${groupIndex}-${tool.id}`} className="w-[208px] flex-shrink-0">
                <div className="marquee-card media-hover-trigger flex h-[112px] items-center justify-center rounded-[28px] px-3">
                  <img
                    src={tool.logoUrl || "/placeholder.svg"}
                    alt={`${tool.name} logo`}
                    className="marquee-logo media-hover-target h-[78px] w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
