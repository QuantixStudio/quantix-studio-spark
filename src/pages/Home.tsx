import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Services from "@/components/landing/Services";
import Process from "@/components/landing/Process";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Tools from "@/components/landing/Tools";
import RealResults from "@/components/landing/RealResults";
import FeaturedProjects from "@/components/landing/FeaturedProjects";
import Testimonials from "@/components/landing/Testimonials";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          const offset = 64;
          const y = element.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Quantix Studio — AI Web Development & Automation</title>
        <meta name="description" content="AI-powered web development and business automation with n8n & Supabase. Modern apps, AI integration, automated workflows." />
        <link rel="canonical" href="https://quantix-studio-spark.lovable.app/" />
      </Helmet>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <WhyChooseUs />
        <Tools />
        <RealResults />
        <FeaturedProjects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
