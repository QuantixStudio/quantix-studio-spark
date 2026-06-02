import { Zap, Bot, Lock, Palette } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { IconGroupBadge } from "@/components/shared/IconGroupBadge";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: 
        "Automation-first development lets us deliver full MVPs 3× faster than traditional teams.",
    },
    {
      icon: Bot,
      title: "AI-Powered",
      description:
        "From smart assistants to internal tools - we embed AI directly into your workflows.",
    },
    {
      icon: Lock,
      title: "Secure & Scalable",
      description:
        "Built on Supabase with row-level security, encrypted storage, and GDPR-ready infrastructure.",
    },
    {
      icon: Palette,
      title: "UX-Driven Design",
      description:
        "Clean, modern UI paired with intuitive UX, designed around real user journeys.",
    },
  ];

  return (
    <section className="section-container bg-muted/30">
      <FadeInUp>
        <div className="mb-20 text-center">
          <h2 className="section-title">Why Choose Quantix Studio</h2>
          <p className="section-subtitle">
            We combine cutting-edge technology with proven development practices
          </p>
        </div>
      </FadeInUp>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
        {features.map((feature, idx) => {
          return (
            <StaggerItem key={idx}>
              <FeatureCard
                align="center"
                className="min-h-[300px]"
                contentClassName="px-8 pb-8 pt-9"
                iconWrapperClassName="mb-7 h-14"
                titleWrapperClassName="mb-4 min-h-0"
                toolsWrapperClassName="mb-0 min-h-0"
                descriptionWrapperClassName="mt-auto pt-8"
                icon={<IconGroupBadge icon={feature.icon} className="mx-auto" />}
                title={feature.title}
                description={feature.description}
              />
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
