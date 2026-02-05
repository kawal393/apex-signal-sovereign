 import * as React from "react";
 import { Slot } from "@radix-ui/react-slot";
 import { cva, type VariantProps } from "class-variance-authority";
 import { cn } from "@/lib/utils";
 
 const apexButtonVariants = cva(
   "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 tracking-wide uppercase",
   {
     variants: {
       variant: {
         primary:
           "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] border border-primary/50",
         ghost:
           "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
         outline:
           "border border-border bg-transparent text-foreground hover:bg-secondary/30 hover:border-primary/50",
         glass:
           "bg-secondary/50 backdrop-blur-md border border-border text-foreground hover:bg-secondary/70 hover:border-primary/30",
         link:
           "text-muted-foreground underline-offset-4 hover:text-primary hover:underline",
       },
       size: {
         default: "h-12 px-8 py-3 rounded-lg",
         sm: "h-9 px-4 py-2 rounded-md text-xs",
         lg: "h-14 px-12 py-4 rounded-lg text-base",
         icon: "h-10 w-10 rounded-lg",
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