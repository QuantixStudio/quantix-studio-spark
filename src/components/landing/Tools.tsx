import { FadeInUp } from "@/components/animations/FadeInUp";
import ToolsCarousel from "./ToolsCarousel";

export default function Tools() {
  return (
    <section id="tools" className="w-full bg-[#0F0F0F] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <FadeInUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tools We Use
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
