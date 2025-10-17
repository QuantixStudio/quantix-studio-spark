import { Card, CardContent } from "@/components/ui/card";
import { Zap, Bot, Lock, Palette } from "lucide-react";

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
        "From smart assistants to internal tools — we embed AI directly into your workflows.",
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
            <Card key={idx} className="text-center border transition-colors hover:border-accent h-full flex flex-col">
              <CardContent className="pt-8 flex-1 flex flex-col">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-accent mb-4">
                  <Icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="[text-align:justify] [text-justify:inter-word] leading-relaxed">
                   {feature.description}
               </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold mb-6">Real Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <p className="text-4xl font-bold text-accent mb-2">10+</p>
            <p className="text-muted-foreground">Projects Delivered</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent mb-2">3 weeks</p>
            <p className="text-muted-foreground">Average MVP Timeline</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent mb-2">25+</p>
            <p className="text-muted-foreground">Automated Workflows</p>
          </div>
        </div>
      </div>
    </section>
  );
}
