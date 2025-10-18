import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function CalloutStrip({ className }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleOpenInquiry = () => {
    // If on portfolio page, navigate to home first
    if (location.pathname === "/portfolio") {
      navigate("/#contact");
      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
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
        <Button size="lg" variant="outline" className="bg-white text-black hover:bg-white/90 border-none" onClick={handleOpenInquiry}>
          Book a Discovery Call
        </Button>
      </div>
    </section>;
}