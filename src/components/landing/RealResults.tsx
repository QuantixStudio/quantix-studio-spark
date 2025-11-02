import { FadeInUp } from "@/components/animations/FadeInUp";

export default function RealResults() {
  return (
    <section className="section-container bg-muted/30">
      <FadeInUp>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Real Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <p className="text-4xl font-bold text-accent mb-2">20+</p>
              <p className="text-muted-foreground">Projects Delivered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">4 weeks</p>
              <p className="text-muted-foreground">Average MVP Timeline</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-accent mb-2">35+</p>
              <p className="text-muted-foreground">Automated Workflows</p>
            </div>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
}
