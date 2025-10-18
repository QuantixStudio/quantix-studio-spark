import { useServices } from "@/hooks/useServices";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";
export default function Services() {
  const {
    data: services,
    isLoading
  } = useServices();
  const { isVisible, ref } = useScrollReveal({ triggerOnce: true, threshold: 0.2 });

  const fallbackServices = [
    {
      id: "fallback-1",
      title: "No-Code Development",
      description:
        "Tools: Bubble · Webflow · WeWeb · Lovable\nWe design and launch full-scale digital products using modern no-code and low-code platforms — combining speed, scalability, and great design.",
      order_index: 1,
      published: true,
      service_icon: { id: "icon-1", name: "LayoutGrid", icon_url: null },
    },
    {
      id: "fallback-2",
      title: "AI-Powered Automation",
      description:
        "Tools: n8n · GPT · Supabase\nWe build AI-driven workflows and automations that save time, cut manual work, and connect your business systems into one intelligent ecosystem.",
      order_index: 2,
      published: true,
      service_icon: { id: "icon-2", name: "Brain", icon_url: null },
    },
    {
      id: "fallback-3",
      title: "Scalable Cloud Backend",
      description:
        "Tools: Supabase\nWe set up secure, serverless backends using Supabase — with real-time data, authentication, storage, and edge functions ready to scale.",
      order_index: 3,
      published: true,
      service_icon: { id: "icon-3", name: "Server", icon_url: null },
    },
    {
      id: "fallback-4",
      title: "Integration & Workflows",
      description:
        "Tools: n8n · Notion · Airtable · Slack\nWe integrate your favorite tools into a seamless digital workflow — automating operations and ensuring your data stays perfectly in sync.",
      order_index: 4,
      published: true,
      service_icon: { id: "icon-4", name: "PanelsTopLeft", icon_url: null },
    },
  ];

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as any;
    return Icon ? <Icon className="h-12 w-12 text-accent" /> : null;
  };

  const list = (services && services.length ? services : fallbackServices);
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
        </div> : <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((service, index) => <Card key={service.id} className={`border transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/10 rounded-2xl flex flex-col h-full group ${isVisible ? 'scroll-reveal-item' : ''}`}>
              <CardContent className="pt-6 flex-1 flex flex-col">
                {/* Icon Section - Fixed height */}
                <div className="h-12 mb-6 flex items-center transition-all duration-300 group-hover:scale-110">
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
                      {service.description.split("\n")[0].replace(/^Tools:\s*/i, "")}
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