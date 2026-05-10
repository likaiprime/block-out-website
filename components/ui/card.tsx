import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Surface card with optional 1px top accent bar.
 *
 * Canonical: DESIGN.md §7.4 + §8.2.
 *
 * Each accent must spell out its full bar utility — Tailwind v4's JIT can't see
 * dynamic class composition.
 */
const cardVariants = cva(
  "relative rounded-2xl border bg-card overflow-hidden",
  {
    variants: {
      padding: {
        none: "",
        sm: "p-5",
        md: "p-6",
        lg: "p-6 pt-7",
      },
      interactive: {
        true: "spring-hover hover:shadow-lg hover:shadow-foreground/5 hover:border-foreground/15",
        false: "",
      },
    },
    defaultVariants: {
      padding: "md",
      interactive: false,
    },
  },
);

const accentBarVariants = cva("absolute inset-x-0 top-0 h-1", {
  variants: {
    accent: {
      red: "bg-block-red",
      orange: "bg-block-orange",
      yellow: "bg-block-yellow",
      green: "bg-block-green",
      blue: "bg-block-blue",
      purple: "bg-block-purple",
    },
  },
});

type AccentBarVariant = NonNullable<VariantProps<typeof accentBarVariants>["accent"]>;

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Adds a 1px top accent bar in the named color. */
  accent?: AccentBarVariant;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding, interactive, accent, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ padding, interactive, className }))}
        {...props}
      >
        {accent ? (
          <span aria-hidden className={accentBarVariants({ accent })} />
        ) : null}
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

export { Card, cardVariants, accentBarVariants };
