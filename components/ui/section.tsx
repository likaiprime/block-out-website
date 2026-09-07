import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Page section wrapper with a max-width container and optional eyebrow / title /
 * subtitle slots. Encodes the "eyebrow → H2 → subtitle" rhythm from
 * DESIGN.md §8.1.
 */
const sectionVariants = cva("relative", {
  variants: {
    tone: {
      default: "",
      muted: "bg-secondary/40",
      bare: "",
      checker: "bg-checker",
    },
    density: {
      default: "py-20 sm:py-24",
      hero: "pt-[calc(5.5rem+env(safe-area-inset-top))] pb-12 sm:pb-16 md:pt-28 md:pb-24",
      compact: "py-12 sm:py-16",
    },
  },
  defaultVariants: {
    tone: "default",
    density: "default",
  },
});

type DividerVariant = "none" | "blocks" | "line";

export interface SectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    VariantProps<typeof sectionVariants> {
  /** Eyebrow chip — typically a `<Badge>`. */
  eyebrow?: React.ReactNode;
  /** Section heading — rendered as H2. Use `headingLevel` for other levels. */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Override H tag (page hero may want H1). Default `h2`. */
  headingLevel?: "h1" | "h2";
  /** Extra className for the inner container (e.g. `max-w-5xl`). */
  containerClassName?: string;
  /** Extra className for the heading block. */
  headerClassName?: string;
  /** Bottom divider style — defaults to dashed six-color blocks. */
  divider?: DividerVariant;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      containerClassName,
      headerClassName,
      tone,
      density,
      eyebrow,
      title,
      subtitle,
      headingLevel = "h2",
      children,
      ...props
    },
    ref,
  ) => {
    const Heading = headingLevel;
    const showHeader = Boolean(eyebrow || title || subtitle);
    return (
      <section
        ref={ref}
        className={cn(sectionVariants({ tone, density }), className)}
        {...props}
      >
        <div className={cn("container", containerClassName)}>
          {showHeader && (
            <div className={cn("max-w-2xl", headerClassName)}>
              {eyebrow}
              {title ? (
                <Heading
                  className={cn(
                    "text-3xl sm:text-4xl font-black tracking-tight",
                    eyebrow ? "mt-4" : undefined,
                  )}
                >
                  {title}
                </Heading>
              ) : null}
              {subtitle ? (
                <p className="mt-3 text-muted-foreground text-lg leading-relaxed">
                  {subtitle}
                </p>
              ) : null}
            </div>
          )}
          {children}
        </div>
      </section>
    );
  },
);
Section.displayName = "Section";

export { Section, sectionVariants };
