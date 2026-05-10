import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Eyebrow / label chip. Used as the small label above section headings.
 *
 * Canonical: DESIGN.md §7.2.
 *
 * Each accent variant must list every utility it needs so Tailwind v4's JIT
 * can see them in source. Don't compose `bg-block-${color}/10` dynamically.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      accent: {
        red: "border-block-red/25 bg-block-red/10 text-block-red",
        orange: "border-block-orange/25 bg-block-orange/10 text-block-orange",
        yellow: "border-block-yellow/30 bg-block-yellow/10 text-foreground",
        green: "border-block-green/25 bg-block-green/10 text-block-green",
        blue: "border-block-blue/25 bg-block-blue/10 text-block-blue",
        purple: "border-block-purple/25 bg-block-purple/10 text-block-purple",
        neutral: "border-border bg-secondary text-foreground",
      },
    },
    defaultVariants: {
      accent: "blue",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  /** Optional leading icon — sized 14px (h-3.5) automatically. */
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, accent, asChild, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cn(badgeVariants({ accent, className }))}
        {...props}
      >
        {icon ? <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{icon}</span> : null}
        {children}
      </Comp>
    );
  },
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
