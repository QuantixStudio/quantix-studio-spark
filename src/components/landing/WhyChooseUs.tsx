import { Card, CardContent } from "@/components/ui/card";
import { Zap, Bot, Lock, Palette } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Automation-first approach delivers projects 3x faster than traditional development.",
    },
    {
      icon: Bot,
      title: "AI-Powered",
      description:
        "Smart workflows and intelligent integrations that adapt to your business needs.",
    },
    {
      icon: Lock,
      title: "Secure & Scalable",
      description:
        "Enterprise-grade infrastructure with Supabase ensuring data security and growth.",
    },
    {
      icon: Palette,
      title: "Modern Design",
      description:
        "Clean, minimal aesthetics with responsive interfaces that users love.",
    },
  ];

  return (
    <section className="section-container bg-muted/30">
      <div className="text-center mb-16">
        <h2 className="section-title">Why Choose Quantix Studio</h2>
        <p className="section-subtitle">
          We combine cutting-edge technology with proven development practices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <Card key={idx} className="text-center hover-lift border-border/50">
              <CardContent className="pt-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
