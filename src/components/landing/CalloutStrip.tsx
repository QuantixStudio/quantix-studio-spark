import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { scrollToSection } from "@/lib/navigation";

export default function CalloutStrip({ className }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleOpenInquiry = () => {
    trackEvent("discovery_call_cta_click", {
      event_category: "lead",
      source: "callout_strip",
    });

    if (location.pathname !== "/") {
      navigate("/#contact");
    } else {
      scrollToSection("contact");
    }
  };
  return <section className={cn("bg-primary text-primary-foreground py-16", className)}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Need something similar?
        </h2>
        <p className="text-lg mb-8 opacity-90 text-white">
          Let's discuss your project requirements
        </p>
        <Button size="lg" variant="marketing" onClick={handleOpenInquiry}>
          Book a Discovery Call
        </Button>
      </div>
    </section>;
}
