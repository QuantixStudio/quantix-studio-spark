import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ArrowButtonProps = ButtonProps & {
  direction: "left" | "right";
};

const directionLabel: Record<ArrowButtonProps["direction"], string> = {
  left: "Previous slide",
  right: "Next slide",
};

const directionIcon = {
  left: ArrowLeft,
  right: ArrowRight,
} satisfies Record<ArrowButtonProps["direction"], React.ComponentType<{ className?: string }>>;

const ArrowButton = React.forwardRef<HTMLButtonElement, ArrowButtonProps>(
  ({ className, direction, variant = "ghost", size = "icon", ...props }, ref) => {
    const Icon = directionIcon[direction];

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("arrow-button", className)}
        {...props}
      >
        <Icon className="h-[1.125rem] w-[1.125rem]" />
        <span className="sr-only">{directionLabel[direction]}</span>
      </Button>
    );
  },
);
ArrowButton.displayName = "ArrowButton";

export { ArrowButton, type ArrowButtonProps };
