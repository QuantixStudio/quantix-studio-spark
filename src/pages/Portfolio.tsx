import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import ProjectGrid from "@/components/portfolio/ProjectGrid";
import CalloutStrip from "@/components/landing/CalloutStrip";
export default function Portfolio() {
  return <div className="min-h-screen bg-background">
      <Navbar />
      <PortfolioHero className="bg-inherit" />
      <ProjectGrid />
      <CalloutStrip className="bg-inherit" />
      <Footer />
    </div>;
}