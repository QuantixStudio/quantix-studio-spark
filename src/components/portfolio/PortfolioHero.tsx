import { cn } from "@/lib/utils";

export default function PortfolioHero({ className }: { className?: string }) {
  return <section className={cn("container mx-auto px-4 pt-20 pb-16 text-center", className)}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
          Our Portfolio
        </h1>
        <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8">
          Explore our collection of successful projects and innovative solutions that transform ideas into reality
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <span className="font-semibold text-accent">50+</span>
            <span className="text-muted-foreground">Projects Delivered</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <span className="font-semibold text-accent">30+</span>
            <span className="text-muted-foreground">Happy Clients</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <span className="font-semibold text-accent">100%</span>
            <span className="text-muted-foreground">Satisfaction Rate</span>
          </div>
        </div>
      </div>
    </section>;
}