import { FadeInUp } from "@/components/animations/FadeInUp";
import ToolsCarousel from "./ToolsCarousel";

export default function Tools() {
  return (
    <section id="tools" className="section-container !max-w-none bg-background">
      <div className="mx-auto max-w-7xl">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tools We Use
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
              Powered by the best no-code, low-code, and AI platforms
            </p>
          </div>
        </FadeInUp>

        {/* Carousel */}
        <ToolsCarousel />
      </div>
    </section>
  );
}
