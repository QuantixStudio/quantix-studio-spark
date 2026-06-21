import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export const overlayCloseButtonClassName =
  "absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-background/80 text-muted-foreground shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-accent/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[state=open]:border-white/15 data-[state=open]:bg-accent/70 data-[state=open]:text-foreground";

export const OverlayCloseButtonIcon = React.forwardRef<SVGSVGElement, React.ComponentProps<typeof X>>(
  ({ className, ...props }, ref) => (
    <X
      ref={ref}
      className={cn("h-4 w-4", className)}
      {...props}
    />
  ),
);

OverlayCloseButtonIcon.displayName = "OverlayCloseButtonIcon";
