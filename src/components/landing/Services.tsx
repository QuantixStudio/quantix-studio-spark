import { useServices } from "@/hooks/useServices";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { IconGroupBadge } from "@/components/shared/IconGroupBadge";
import type { ServiceWithIcon } from "@/types/app";

type DisplayService = Pick<
  ServiceWithIcon,
  "id" | "title" | "description" | "order_index" | "published" | "service_icon"
>;
export default function Services() {
  const {
    data: services,
    isLoading
  } = useServices();

  const fallbackServices: DisplayService[] = [
    {
      id: "fallback-1",
      title: "Bubble SaaS & Platform Development",
      description:
        "Production-ready SaaS apps, marketplaces, dashboards, admin panels, client portals and CRM-style platforms built in Bubble.",
      order_index: 1,
      published: true,
      service_icon: { id: "icon-1", name: "LayoutGrid", icon_url: null },
    },
    {
      id: "fallback-2",
      title: "AI Features & Workflow Automation",
      description:
        "OpenAI/Claude-powered workflows, assistants, document processing, content systems, smart imports, reports and automation logic.",
      order_index: 2,
      published: true,
      service_icon: { id: "icon-2", name: "Brain", icon_url: null },
    },
    {
      id: "fallback-3",
      title: "Custom Backend & API Integrations",
      description:
        "Vercel/serverless endpoints, webhooks, custom APIs, file processing, Stripe/Paddle, OAuth, background jobs and external service integrations.",
      order_index: 3,
      published: true,
      service_icon: { id: "icon-3", name: "Server", icon_url: null },
    },
    {
      id: "fallback-4",
      title: "Bubble Rescue & Scaling",
      description:
        "Fix slow Bubble apps, broken workflows, database issues, privacy rules, API problems and messy architecture.",
      order_index: 4,
      published: true,
      service_icon: { id: "icon-4", name: "PanelsTopLeft", icon_url: null },
    },
  ];

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const iconLibrary = LucideIcons as unknown as Record<string, LucideIcon>;
    const Icon = iconLibrary[iconName];
    return Icon ? <IconGroupBadge icon={Icon} /> : null;
  };

  const parseServiceContent = (description: string) => {
    if (!description.includes("Tools:")) {
      return {
        tools: undefined,
        body: description,
      };
    }

    const [toolsLine, ...bodyLines] = description.split("\n");

    return {
      tools: toolsLine.replace(/^Tools:\s*/i, ""),
      body: bodyLines.join("\n").trim(),
    };
  };

  const renderServiceIcon = (service: DisplayService) => {
    if (service.service_icon?.icon_url) {
      return (
        <IconGroupBadge>
          <img
            src={service.service_icon.icon_url}
            alt={service.service_icon.name}
            className="icon-group-badge-icon h-12 w-12 object-contain"
          />
        </IconGroupBadge>
      );
    }

    if (service.service_icon?.name) {
      return getIcon(service.service_icon.name);
    }

    return <IconGroupBadge><span className="icon-group-badge-icon text-2xl text-white">🔧</span></IconGroupBadge>;
  };

  const list = (services && services.length ? services : fallbackServices);
  return <section id="services" className="section-container">
      <FadeInUp>
        <div className="text-center mb-16">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive solutions powered by modern technology and AI
          </p>
        </div>
      </FadeInUp>

      {isLoading ? <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="showcase-surface rounded-[28px] p-8">
              <Skeleton className="mb-6 h-12 w-12 rounded-lg" />
              <Skeleton className="mb-4 h-6 w-3/4" />
              <Skeleton className="mb-4 h-4 w-2/3" />
              <Skeleton className="h-20 w-full" />
            </div>)}
        </div> : <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
          {list.map((service) => {
            const { tools, body } = parseServiceContent(service.description);

            return (
              <StaggerItem key={service.id}>
                <FeatureCard
                  title={service.title}
                  tools={tools}
                  description={body}
                  icon={renderServiceIcon(service)}
                  titleWrapperClassName="mb-1 min-h-[4.5rem]"
                  toolsWrapperClassName="mb-1 min-h-0"
                />
              </StaggerItem>
            );
          })}
        </StaggerContainer>}
    </section>;
}
