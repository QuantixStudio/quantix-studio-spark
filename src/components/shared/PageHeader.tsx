import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  titleId?: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  titleId,
  description,
  eyebrow,
  actions,
  centered = false,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:gap-5",
        centered ? "items-center text-center" : "sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="content-stack-sm">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">
            {eyebrow}
          </p>
        ) : null}
        <div className="content-stack-sm">
          <h1 id={titleId} className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          {description ? <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p> : null}
        </div>
      </div>

      {actions ? <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">{actions}</div> : null}
    </div>
  );
}
