import Footer from "@/components/landing/Footer";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import ProjectGrid from "@/components/portfolio/ProjectGrid";
import CalloutStrip from "@/components/landing/CalloutStrip";
export default function Portfolio() {
  return <div className="min-h-screen bg-background">
      <PortfolioHero className="bg-inherit pt-16" />
      <ProjectGrid />
      <CalloutStrip className="bg-inherit" />
      <Footer />
    </div>;
}