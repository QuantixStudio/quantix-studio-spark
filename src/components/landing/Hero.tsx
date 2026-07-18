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
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background pt-28 pb-20 md:pt-36 md:pb-28">
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-75 motion-reduce:hidden"
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/product-development-montage.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/[0.56] backdrop-blur-[2px]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/[0.49] via-black/[0.35] to-black/[0.63]" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-5 py-16 sm:px-6 md:px-8 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInUp delay={0}>
            <h1 className="mx-auto mb-6 max-w-6xl text-balance text-center text-4xl font-bold leading-[0.95] tracking-tight hyphens-none sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">AI-powered Bubble platforms</span>
              <span className="block">SaaS apps &amp; internal tools</span>
            </h1>
          </FadeInUp>
 
          <FadeInUp delay={0.2}>
            <p className="mx-auto mb-12 max-w-5xl text-center text-xl text-muted-foreground md:text-2xl">
              We build production-ready Bubble applications with custom backend logic, API integrations, AI workflows, dashboards, client portals, and automation systems.
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
