import { Button } from "@/components/ui/button";

export default function CalloutStrip() {
  const handleOpenInquiry = () => {
    // Scroll to contact section
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Need something similar?
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Let's discuss your project requirements
        </p>
        <Button
          size="lg"
          variant="outline"
          className="bg-transparent border-2 border-accent text-primary-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={handleOpenInquiry}
        >
          Book a Discovery Call
        </Button>
      </div>
    </section>
  );
}
