import { FadeInUp } from "@/components/animations/FadeInUp";

const results = [
  {
    value: "20+",
    label: "Products Delivered",
  },
  {
    value: "20+",
    label: "API Integrations",
  },
  {
    value: "100K+",
    label: "Users Supported",
  },
  {
    value: "35+",
    label: "Automated Workflows",
  },
];

export default function RealResults() {
  return (
    <section className="section-container bg-background">
      <div className="mx-auto max-w-5xl">
        <FadeInUp>
          <div className="mb-12 text-center md:mb-14">
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Real Results
            </h2>
          </div>
        </FadeInUp>
        <div className="overflow-hidden rounded-[32px]">
          <div className="grid grid-cols-1 divide-y divide-white/6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
            {results.map((result) => (
              <div
                key={result.label}
                className="px-8 py-10 text-center md:px-10 md:py-12"
              >
                <div className="mx-auto mb-5 h-px w-12 bg-white/10" />
                <p className="mb-3 text-5xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                  {result.value}
                </p>
                <p className="mx-auto max-w-[14ch] text-base font-medium leading-snug text-[hsl(var(--copy-foreground))] md:text-lg">
                  {result.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
