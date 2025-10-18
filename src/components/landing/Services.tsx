import { useServices } from "@/hooks/useServices";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";
export default function Services() {
  const {
    data: services,
    isLoading
  } = useServices();
  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as any;
    return Icon ? <Icon className="h-12 w-12 text-accent" /> : null;
  };
  return <section id="services" className="section-container">
      <div className="text-center mb-16">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Comprehensive solutions powered by modern technology and AI
        </p>
      </div>

      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => <Card key={i} className="hover-lift">
              <CardContent className="pt-6">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>)}
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services?.map(service => <Card key={service.id} className="border transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/10 rounded-2xl flex flex-col h-full">
              <CardContent className="pt-6 flex-1 flex flex-col">
                {/* Icon Section - Fixed height */}
                <div className="h-12 mb-6 flex items-center">
                  {service.service_icon?.icon_url ? <img src={service.service_icon.icon_url} alt={service.service_icon.name} className="h-12 w-12 object-contain" /> : service.service_icon?.name ? getIcon(service.service_icon.name) : <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🔧</span>
                    </div>}
                </div>

                {/* Title Section - Fixed height */}
                <div className="h-14 mb-4 flex items-start">
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>

                {/* Tools Section - Fixed height */}
                <div className="h-10 mb-4">
                  {service.description.includes("Tools:") && <p className="text-sm text-accent/80">
                      {service.description.split("\n")[0]}
                    </p>}
                </div>

                {/* Description Section - Flexible height */}
                <div className="flex-1">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {service.description.includes("Tools:") ? service.description.split("\n").slice(1).join("\n").trim() : service.description}
                  </p>
                </div>
              </CardContent>
            </Card>)}
        </div>}
    </section>;
}