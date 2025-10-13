import { useServices } from "@/hooks/useServices";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";

export default function Services() {
  const { data: services, isLoading } = useServices();

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as any;
    return Icon ? <Icon className="h-12 w-12 text-primary" /> : null;
  };

  return (
    <section id="services" className="section-container">
      <div className="text-center mb-16">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          Comprehensive solutions powered by modern technology and AI
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="hover-lift">
              <CardContent className="pt-6">
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services?.map((service) => (
            <Card key={service.id} className="hover-lift border-border/50">
              <CardContent className="pt-6">
                {service.service_icon?.icon_url ? (
                  <img
                    src={service.service_icon.icon_url}
                    alt={service.service_icon.name}
                    className="h-12 w-12 mb-4 object-contain"
                  />
                ) : service.service_icon?.name ? (
                  <div className="mb-4">{getIcon(service.service_icon.name)}</div>
                ) : (
                  <div className="h-12 w-12 mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔧</span>
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
