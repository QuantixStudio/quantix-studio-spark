import { useEffect } from "react";
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
import { scrollToSection } from "@/lib/navigation";

export default function Home() {
  // Handle hash-based scrolling when navigating from other pages
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const timeoutId = window.setTimeout(() => {
        scrollToSection(hash.substring(1));
      }, 100);

      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
      <Footer />
    </div>
  );
}
