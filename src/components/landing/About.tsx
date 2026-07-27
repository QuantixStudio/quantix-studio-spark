import { Target, Zap, Shield } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { IconGroupBadge } from "@/components/shared/IconGroupBadge";

export default function About() {
  return (
    <section className="section-container bg-background">
      <div className="max-w-5xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-16">
            <h2 className="section-title">About Quantix Studio</h2>
            <p className="mx-auto mt-6 max-w-6xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              We build AI-powered Bubble platforms for modern product teams. Quantix Studio helps founders, agencies, and growing teams launch SaaS products, client portals, dashboards, CRMs, internal tools, and automation-heavy applications. We combine Bubble&apos;s speed with custom backend logic, APIs, AI workflows, serverless functions, and external integrations to build products that are fast to launch and strong enough to support real users, data, payments, workflows, and future growth.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          <StaggerItem className="icon-group-trigger media-hover-trigger text-center space-y-4 group">
            <IconGroupBadge icon={Zap} />
            <h3 className="text-xl font-semibold">Bubble Platforms</h3>
            <p className="text-muted-foreground">
              SaaS products, portals, dashboards, CRMs, and internal tools built with speed and flexibility.
            </p>
          </StaggerItem>

          <StaggerItem className="icon-group-trigger media-hover-trigger text-center space-y-4 group">
            <IconGroupBadge icon={Target} />
            <h3 className="text-xl font-semibold">AI Workflows</h3>
            <p className="text-muted-foreground">
              AI assistants, smart automations, API logic, and workflow systems connected to your product.
            </p>
          </StaggerItem>

          <StaggerItem className="icon-group-trigger media-hover-trigger text-center space-y-4 group">
            <IconGroupBadge icon={Shield} />
            <h3 className="text-xl font-semibold">Product Foundation</h3>
            <p className="text-muted-foreground">
              Structured data, permissions, payments, integrations, and backend logic ready for growth.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
