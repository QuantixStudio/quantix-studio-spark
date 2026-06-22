import { useMemo } from "react";
import { useTechnologies } from "@/hooks/useTechnologies";
import { getToolLogoUrl } from "@/lib/toolStorageUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { StatePanel } from "@/components/shared/StatePanel";

export default function ToolsCarousel() {
  const { data: technologies, isLoading } = useTechnologies();

  const featuredTechnologies = useMemo(() => {
    if (!technologies) return [];

    return technologies
      .map((technology) => ({
        id: technology.id,
        name: technology.name,
        logoUrl: getToolLogoUrl(technology.logo_path ?? null),
      }));
  }, [technologies]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-8 py-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[112px] w-[208px] rounded-[28px]" />
        ))}
      </div>
    );
  }

  if (featuredTechnologies.length === 0) {
    return (
      <StatePanel
        title="No technologies with logos yet"
        description="Add logos to technologies in the admin area and they will appear here automatically."
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
            {featuredTechnologies.map((technology) => (
              <div key={`${groupIndex}-${technology.id}`} className="w-[208px] flex-shrink-0">
                <div className="marquee-card media-hover-trigger flex h-[112px] items-center justify-center rounded-[28px] px-3">
                  <img
                    src={technology.logoUrl || "/placeholder.svg"}
                    alt={`${technology.name} logo`}
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
