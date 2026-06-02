import { cn } from "@/lib/utils";

export default function PortfolioHero({ className }: { className?: string }) {
  return <section className={cn("container mx-auto px-5 pt-28 pb-10 text-center sm:px-6 md:px-8 md:pt-32", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">Selected client work</p>
      <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-6xl">Our Portfolio</h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
        Explore our collection of successful projects and innovative solutions
      </p>
    </section>;
}
