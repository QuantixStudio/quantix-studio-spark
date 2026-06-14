import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { ProcessStageCard } from "@/components/shared/ProcessStageCard";
import { useHowWeWork } from "@/hooks/useHowWeWork";

export default function Process() {
  const { data: stepsFromSupabase, isLoading, isError } = useHowWeWork();

  const steps = stepsFromSupabase ?? [];

  const getIcon = (iconName: string): LucideIcon => {
    const iconLibrary = LucideIcons as unknown as Record<string, LucideIcon>;
    return iconLibrary[iconName] ?? LucideIcons.Search;
  };

  const getStepNumber = (order: number) => String(order).padStart(2, "0");

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

      {isLoading ? (
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/60 p-8 text-center text-muted-foreground">
          Loading How We Work from Supabase...
        </div>
      ) : isError ? (
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/60 p-8 text-center text-muted-foreground">
          How We Work data could not be loaded from Supabase.
        </div>
      ) : steps.length === 0 ? (
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/60 p-8 text-center text-muted-foreground">
          No published rows found in the <code>how_we_work</code> table.
        </div>
      ) : (
        <StaggerContainer className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8" staggerDelay={0.1}>
          {steps.map((step, idx) => {
            return (
              <StaggerItem key={step.id} className={idx % 2 === 1 ? "xl:translate-y-8" : ""}>
                <ProcessStageCard
                  icon={getIcon(step.icon_name)}
                  number={getStepNumber(step.order)}
                  title={step.title}
                  subtitle={step.subtitle ?? ""}
                  description={step.description}
                />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </section>
  );
}
