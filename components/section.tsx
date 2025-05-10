import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

const sectionVariants = tv({
  base: "container p-4 m-auto md:px-0",
  variants: {
    variant: {
      default: "",
      noPadding: "p-0",
      centered: "flex items-center justify-center",
      screenCentered: "flex items-center justify-center min-h-[calc(100vh_-_theme(spacing.16))]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Section = React.forwardRef<HTMLInputElement, SectionProps>(
  ({ children, variant, className }, ref) => {
    return <section className={sectionVariants({ variant, className })}>{children}</section>;
  },
);
Section.displayName = "Section";

export { Section };
