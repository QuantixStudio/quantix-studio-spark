import { Target, Zap, Shield } from "lucide-react";

export default function About() {
  return (
    <section className="section-container bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">About Quantix Studio</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mt-6">
            Quantix Studio is a fast no/low-code product studio. 
            In 3–4 weeks we ship investor-ready MVPs and AI automations that cut manual work and deliver first metrics—signups, MRR, leads. 
            Stack: Bubble, Supabase, n8n, GPT; we connect analytics, payments, external APIs, and build secure infra (RLS/GDPR). 
            Process: cut-list → prototype → core flows → release. 10+ products and 25+ automations shipped—without excess code or months of waiting.{" "}
          </p>
           <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mt-6">
             Average MVP timeline — 4 weeks, 60% cheaper than code{" "}
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
