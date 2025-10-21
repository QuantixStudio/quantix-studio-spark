import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import ProjectGrid from "@/components/portfolio/ProjectGrid";

export default function Portfolio() {
  return <div className="min-h-screen bg-background">
      <Navbar />
      <PortfolioHero className="bg-inherit pt-20" />
      <ProjectGrid />
      <Footer />
    </div>;
}