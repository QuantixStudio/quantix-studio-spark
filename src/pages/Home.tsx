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

export default function Home() {
  // Handle hash-based scrolling when navigating from other pages
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          const offset = 64; // Fixed header height
          const y = element.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top: y,
            behavior: "smooth"
          });
        }
      }, 100);
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
