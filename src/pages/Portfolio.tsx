import Footer from "@/components/landing/Footer";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import ProjectGrid from "@/components/portfolio/ProjectGrid";
import CalloutStrip from "@/components/landing/CalloutStrip";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <PortfolioHero />
      <ProjectGrid />
      <CalloutStrip className="mt-8" />
      <Footer />
    </div>
  );
}