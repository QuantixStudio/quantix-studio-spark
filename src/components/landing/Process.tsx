import { Search, Palette, Workflow, Rocket } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { ProcessStageCard } from "@/components/shared/ProcessStageCard";

export default function Process() {
  const steps = [
    {
      icon: Search,
      number: "01",
      title: "Discovery & Planning",
      subtitle: "Research & Scope",
      description: "We start by understanding your goals, target users, and project scope - setting a solid foundation for success.",
    },
    {
      icon: Palette,
      number: "02",
      title: "Design & Prototype",
      subtitle: "Figma UI/UX",
      description: "We create intuitive, beautiful interfaces and interactive prototypes to visualize your product before development.",
    },
    {
      icon: Workflow,
      number: "03",
      title: "Build & Automate",
      subtitle: "No-code Stack (Bubble, n8n, OpenAI)",
      description: "We build fast, scalable products using no-code tools and automate workflows with AI.",
    },
    {
      icon: Rocket,
      number: "04",
      title: "Launch & Scale",
      subtitle: "Fast iteration & analytics",
      description: "We launch, test, and refine - ensuring stability, performance, and long-term scalability.",
    },
  ];

  return (
    <section className="section-container">
      <FadeInUp>
        <div className="text-center mb-16">
          <h2 className="section-title">How We Work</h2>
          <p className="section-subtitle">
            A streamlined process that gets you from idea to launch in weeks, not months
          </p>
        </div>
      </FadeInUp>

      <StaggerContainer className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8" staggerDelay={0.1}>
        {steps.map((step, idx) => {
          return (
            <StaggerItem key={idx} className={idx % 2 === 1 ? "xl:translate-y-8" : ""}>
              <ProcessStageCard
                icon={step.icon}
                number={step.number}
                title={step.title}
                subtitle={step.subtitle}
                description={step.description}
              />
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
