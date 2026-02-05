import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const apexButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase",
  {
    variants: {
      variant: {
        // Primary - Gate button with energy glow
        primary:
          "bg-primary/90 text-primary-foreground hover:bg-primary border border-primary/60 shadow-[0_0_30px_hsl(42,90%,55%,0.2)] hover:shadow-[0_0_50px_hsl(42,90%,55%,0.35)] backdrop-blur-sm",
        // Ghost - subtle, almost invisible
        ghost:
          "text-muted-foreground/70 hover:text-foreground hover:bg-secondary/30 transition-all duration-500",
        // Outline - bordered gate
        outline:
          "border border-border/50 bg-transparent text-foreground/80 hover:bg-primary/5 hover:border-primary/40 hover:text-foreground transition-all duration-500",
        // Glass - dimensional
        glass:
          "bg-card/30 backdrop-blur-xl border border-border/30 text-foreground/80 hover:bg-card/50 hover:border-primary/20 transition-all duration-500",
        // Link - minimal
        link:
          "text-muted-foreground/60 underline-offset-4 hover:text-primary hover:underline transition-all duration-500",
      },
      size: {
        default: "h-12 px-8 py-3 rounded-md tracking-[0.2em]",
        sm: "h-9 px-4 py-2 rounded-sm text-xs tracking-[0.15em]",
        lg: "h-14 px-12 py-4 rounded-md text-sm tracking-[0.25em]",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ApexButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof apexButtonVariants> {
  asChild?: boolean;
}

const ApexButton = React.forwardRef<HTMLButtonElement, ApexButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(apexButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ApexButton.displayName = "ApexButton";

export { ApexButton, apexButtonVariants };
