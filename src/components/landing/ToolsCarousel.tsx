import { useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useTools } from "@/hooks/useTools";
import { getToolLogoUrl } from "@/lib/toolStorageUtils";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Duplicate array for seamless infinite loop
  const duplicatedTools = useMemo(() => {
    if (featuredTools.length === 0) return [];
    // Duplicate enough times to fill viewport (minimum 12 items)
    const minItems = 12;
    const copies = Math.ceil(minItems / featuredTools.length);
    return Array(copies).fill(featuredTools).flat();
  }, [featuredTools]);

  // Embla Carousel with Autoplay plugin
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      containScroll: false,
    },
    [
      Autoplay({
        delay: 0, // Continuous scroll
        stopOnInteraction: false,
        stopOnMouseEnter: true, // Pause on hover
        playOnInit: true,
      }),
    ]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex gap-10 items-center justify-center py-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-12 w-32 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  // Empty state
  if (featuredTools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No featured tools available yet</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Gradient fade overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Embla Carousel */}
      <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
        <div className="flex gap-12 md:gap-16 items-center py-4">
          {duplicatedTools.map((tool, index) => (
            <div key={`${tool.id}-${index}`} className="flex-[0_0_auto]">
              <img
                src={tool.logoUrl || "/placeholder.svg"}
                alt={`${tool.name} logo`}
                className="h-10 sm:h-12 md:h-14 w-auto opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
