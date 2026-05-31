import { Helmet } from "react-helmet-async";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import ProjectGrid from "@/components/portfolio/ProjectGrid";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Portfolio — Quantix Studio Client Projects</title>
        <meta name="description" content="Selected client projects by Quantix Studio: MVPs, web apps, and automations built with React, Supabase, n8n, and AI." />
        <link rel="canonical" href="https://quantix-studio-spark.lovable.app/portfolio" />
      </Helmet>
      <Navbar />
      <main>
        <PortfolioHero className="bg-inherit pt-20" />
        <ProjectGrid />
      </main>
      <Footer />
    </div>
  );
}
