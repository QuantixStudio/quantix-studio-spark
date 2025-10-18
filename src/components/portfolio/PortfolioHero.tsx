import { cn } from "@/lib/utils";

export default function PortfolioHero({ className }: { className?: string }) {
  return <section className={cn("section-container pt-32 pb-8 text-center", className)}>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 my-[30px]">Our Portfolio</h1>
      
    </section>;
}