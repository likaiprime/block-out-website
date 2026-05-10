import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The saturated colored square ("game tile") used in feature cards, hero
 * compositions, and the difficulty legend.
 *
 * Canonical: DESIGN.md §7.5. Uses the global `.block-tile` class for the
 * inner-highlight + drop-shadow stack.
 */
const accentTileVariants = cva(
  "block-tile inline-flex items-center justify-center text-white select-none",
  {
    variants: {
      color: {
        red: "bg-block-red",
        orange: "bg-block-orange",
        yellow: "bg-block-yellow",
        green: "bg-block-green",
        blue: "bg-block-blue",
        purple: "bg-block-purple",
      },
      size: {
        sm: "h-9 w-9",
        md: "h-12 w-12",
        lg: "h-14 w-14",
      },
    },
    defaultVariants: {
      color: "blue",
      size: "md",
    },
  },
);

export interface AccentTileProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof accentTileVariants> {}

const AccentTile = React.forwardRef<HTMLDivElement, AccentTileProps>(
  ({ className, color, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(accentTileVariants({ color, size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  },
);
AccentTile.displayName = "AccentTile";

export { AccentTile, accentTileVariants };
