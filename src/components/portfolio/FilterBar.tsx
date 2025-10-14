import { cn } from "@/lib/utils";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "all", label: "All Projects" },
  { id: "mvp", label: "MVP" },
  { id: "stripe", label: "Stripe" },
  { id: "ai", label: "AI Agent" },
  { id: "automation", label: "Automation" },
];

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="section-container pb-8 pt-0">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide justify-center">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "px-6 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap border",
              activeFilter === filter.id
                ? "bg-accent/10 text-accent border-accent"
                : "bg-background text-muted-foreground border-border hover:border-accent"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
