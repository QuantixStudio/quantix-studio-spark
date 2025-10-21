import { Search, Palette, Workflow, Rocket } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";

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

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto" staggerDelay={0.1}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <StaggerItem key={idx} className="text-center relative group">
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-accent/30" />
              )}
              <div className="mb-3">
                <span className="text-4xl font-bold text-accent/30">{step.number}</span>
              </div>
              <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border-2 border-accent mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                <Icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-accent/80 mb-2">{step.subtitle}</p>
              <p className="text-sm text-muted-foreground [text-align:justify] [text-justify:inter-word]">{step.description}</p>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
