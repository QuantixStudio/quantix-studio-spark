import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { FadeInUp } from "@/components/animations/FadeInUp";
import { scrollToSection } from "@/lib/navigation";

export default function Hero() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToContact = () => {
    if (location.pathname === "/") {
      scrollToSection("contact");
    } else {
      navigate("/#contact");
    }
  };
 
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Content */}
      <div className="container relative z-10 mx-auto px-5 py-16 sm:px-6 md:px-8 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp delay={0}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center hyphens-auto !text-justify">
              Build your MVP in 4 weeks and 60% cheaper than code{" "}
            </h1>
          </FadeInUp>
 
          <FadeInUp delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 mx-auto text-center max-w-none">
              We're a studio that helps founders launch fast, automate smart, and grow scalably.
              <br />
              Build SaaS & CRM apps using Bubble, Lovable, WeWeb, Supabase, n8n, and OpenAI.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="marketing" size="lg" onClick={scrollToContact}>
                Book a Free Strategy Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="marketing"
                size="lg"
                onClick={() => navigate("/portfolio")}
              >
                View Our Work
              </Button>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
