import { Card, CardContent } from "@/components/ui/card";
import { Zap, Bot, Lock, Palette } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";

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
        <div className="text-center mb-16">
          <h2 className="section-title">Why Choose Quantix Studio</h2>
          <p className="section-subtitle">
            We combine cutting-edge technology with proven development practices
          </p>
        </div>
      </FadeInUp>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <StaggerItem key={idx}>
              <Card className="text-center border transition-colors hover:border-accent h-full flex flex-col group">
                <CardContent className="pt-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full border border-accent mb-4 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground [text-align:justify] [text-justify:inter-word] leading-relaxed">
                     {feature.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
