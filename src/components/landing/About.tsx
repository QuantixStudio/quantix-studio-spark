import { Target, Zap, Shield } from "lucide-react";

export default function About() {
  return (
    <section className="section-container bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">About Quantix Studio</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mt-6 hyphens-auto !text-justify">
            Quantix Studio helps founders launch investor-ready products fast. 
            In just 3–4 weeks, we turn ideas into clean, scalable MVPs - 60% cheaper than traditional code. 
            Using Bubble, Lovable, Weweb, Supabase, n8n, OpenAI, we build with automation, analytics, payments, and GDPR-level security from day one. 
            Simple agency flow - cut-list → prototype → core flows → launch - has powered 20+ products and 35+ automations. 
            Our mission: help startups grow faster with clarity, speed, and zero drag.{" "}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-accent">
              <Zap className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">3× Faster</h3>
            <p className="text-muted-foreground">
              Automation-first approach & no-code speed
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-accent">
              <Target className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">AI-Powered</h3>
            <p className="text-muted-foreground">
              Assistant bots, smart routing, GPT workflows
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-accent">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Scalable</h3>
            <p className="text-muted-foreground">
              Secure infrastructure with row-level security, encrypted storage, and compliance-ready architecture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
