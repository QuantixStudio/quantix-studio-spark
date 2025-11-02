import { FadeInUp } from "@/components/animations/FadeInUp";
import ToolsCarousel from "./ToolsCarousel";

export default function Tools() {
  return (
    <>
      {/* Gradient transition from dark to white */}
      <div className="w-full h-16 bg-gradient-to-b from-[#0F0F0F] to-white" />

      {/* Main white section */}
      <section id="tools" className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tools We Use
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Powered by the best no-code, low-code, and AI platforms
              </p>
            </div>
          </FadeInUp>

          {/* Carousel */}
          <ToolsCarousel />
        </div>
      </section>

      {/* Gradient transition from white to dark */}
      <div className="w-full h-16 bg-gradient-to-b from-white to-[#0F0F0F]" />
    </>
  );
}
