import { Target, Zap, Shield } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { IconGroupBadge } from "@/components/shared/IconGroupBadge";

export default function About() {
  return (
    <section className="section-container bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-16">
            <h2 className="section-title">About Quantix Studio</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mx-auto mt-6 hyphens-auto !text-justify">
              Quantix Studio helps founders launch investor-ready products fast. 
              In just 3–4 weeks, we turn ideas into clean, scalable MVPs - 60% cheaper than traditional code. 
              Using Bubble, Lovable, Weweb, Supabase, n8n, OpenAI, we build with automation, analytics, payments, and GDPR-level security from day one. 
              Simple agency flow - cut-list → prototype → core flows → launch - has powered 20+ products and 35+ automations. 
              Our mission: help startups grow faster with clarity, speed, and zero drag.{" "}
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          <StaggerItem className="text-center space-y-4 group">
            <IconGroupBadge icon={Zap} />
            <h3 className="text-xl font-semibold">3× Faster</h3>
            <p className="text-muted-foreground">
              Automation-first approach & no-code speed
            </p>
          </StaggerItem>

          <StaggerItem className="text-center space-y-4 group">
            <IconGroupBadge icon={Target} />
            <h3 className="text-xl font-semibold">AI-Powered</h3>
            <p className="text-muted-foreground">
              Assistant bots, smart routing, GPT workflows
            </p>
          </StaggerItem>

          <StaggerItem className="text-center space-y-4 group">
            <IconGroupBadge icon={Shield} />
            <h3 className="text-xl font-semibold">Secure & Scalable</h3>
            <p className="text-muted-foreground">
              Privacy rules, RLS, GDPR-ready
            </p>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
