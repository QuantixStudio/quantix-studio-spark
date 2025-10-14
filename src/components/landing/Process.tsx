import { Search, Palette, Code, Rocket } from "lucide-react";

export default function Process() {
  const steps = [
    {
      icon: Search,
      title: "Discovery & Planning",
      description: "Research & Scope",
    },
    {
      icon: Palette,
      title: "Design & Prototype",
      description: "Figma UI/UX",
    },
    {
      icon: Code,
      title: "Build & Automate",
      description: "Low-code stack (Supabase, n8n, GPT)",
    },
    {
      icon: Rocket,
      title: "Launch & Scale",
      description: "Fast iteration & analytics",
    },
  ];

  return (
    <section className="section-container">
      <div className="text-center mb-16">
        <h2 className="section-title">How We Work</h2>
        <p className="section-subtitle">
          A streamlined process that gets you from idea to launch in weeks, not months
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="text-center relative">
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border-2 border-accent mb-4">
                <Icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
