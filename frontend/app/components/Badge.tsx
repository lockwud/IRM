import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-irm-primary/40 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-irm-primary text-white hover:bg-irm-primary-hover",
        secondary:
          "border-transparent bg-irm-bg text-irm-text-secondary hover:bg-irm-bg-hover",
        destructive:
          "border-transparent bg-irm-danger text-white hover:bg-irm-danger/80",
        outline: "border-irm-border text-irm-text",
        success:
          "border-transparent bg-irm-success-light text-irm-success",
        warning:
          "border-transparent bg-irm-warning-light text-irm-warning",
        info:
          "border-transparent bg-irm-info-light text-irm-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
