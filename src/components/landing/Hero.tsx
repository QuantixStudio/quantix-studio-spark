import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
 
  return (
    <section className="relative py-32 flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 hyphens-auto !text-justify">
            Build your MVP in 4 weeks and 60% cheaper than code{" "}
          </h1>
 
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto hyphens-auto !text-justify">
            We’re a product studio that helps founders launch fast, automate smart, and grow with clarity.
            <br />
            Built on Bubble, Lovable, Weweb, Supabase, n8n, OpenAI - 60 % cheaper than code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={scrollToContact} className="text-lg">
              Book a Free Strategy Call
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/portfolio")}
              className="text-lg bg-white text-black hover:bg-white/90"
            >
              View Our Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
