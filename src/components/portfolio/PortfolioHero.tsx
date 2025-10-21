import { cn } from "@/lib/utils";

export default function PortfolioHero({ className }: { className?: string }) {
  return <section className={cn("container mx-auto px-4 pt-32 pb-8 text-center", className)}>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">Our Portfolio</h1>
      <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
        Explore our collection of successful projects and innovative solutions
      </p>
    </section>;
}