import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { StaggerContainer } from "@/components/animations/StaggerContainer";
import { StaggerItem } from "@/components/animations/StaggerItem";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { IconGroupBadge } from "@/components/shared/IconGroupBadge";
import { useWhyChooseUs } from "@/hooks/useWhyChooseUs";

export default function WhyChooseUs() {
  const { data: features, isLoading, isError } = useWhyChooseUs();

  const getIcon = (iconName: string): LucideIcon => {
    const iconLibrary = LucideIcons as unknown as Record<string, LucideIcon>;
    return iconLibrary[iconName] ?? LucideIcons.Zap;
  };

  return (
    <section className="section-container bg-background">
      <FadeInUp>
        <div className="mb-20 text-center">
          <h2 className="section-title">Why Choose Quantix Studio</h2>
          <p className="section-subtitle">
            We combine cutting-edge technology with proven development practices
          </p>
        </div>
      </FadeInUp>

      {isLoading ? (
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/60 p-8 text-center text-muted-foreground">
          Loading Why Choose Us from Supabase...
        </div>
      ) : isError ? (
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/60 p-8 text-center text-muted-foreground">
          Why Choose Us data could not be loaded from Supabase.
        </div>
      ) : !features?.length ? (
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border bg-card/60 p-8 text-center text-muted-foreground">
          No rows found in the <code>why_choose_us</code> table.
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
          {features.map((feature, idx) => {
            return (
              <StaggerItem key={String(feature.id)}>
                <FeatureCard
                  align="center"
                  className="min-h-[280px]"
                  contentClassName="px-8 pb-7 pt-8"
                  iconWrapperClassName="mb-6 h-14"
                  titleWrapperClassName="mb-3 min-h-0"
                  toolsWrapperClassName="mb-0 min-h-0"
                  descriptionWrapperClassName="pt-3"
                  icon={<IconGroupBadge icon={getIcon(feature.icon_name)} className="mx-auto" />}
                  title={feature.title}
                  description={feature.description}
                />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </section>
  );
}
