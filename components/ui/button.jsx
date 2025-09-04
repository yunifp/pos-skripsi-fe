import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        loginButton: "bg-[#8BB2B2] hover:bg-[#638B8B] text-white",
        destructive: "bg-rose-500 text-white shadow-sm hover:bg-rose/90",
        success:
          "bg-emerald-500 text-white shadow-sm hover:bg-emerald-500/90 rounded-lg",
        info: "bg-blue-500 text-white shadow-sm hover:bg-blue-500/90 rounded-full",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-slate-100 hover:bg-slate-800 rounded-lg",
        blue: "mb-4 p-2 bg-blue-500 text-white rounded-full w-32",
        link: "text-primary underline-offset-4 hover:underline",
        filter:
          "bg-secondary text-2xl text-secondary-foreground shadow-sm hover:bg-secondary/80",
        button1: "bg-[#8BB2B2] hover:bg-[#638B8B] text-white rounded-full",
        button2: "bg-[#8BB2B2] hover:bg-[#638B8B] text-white rounded-md ",
        buttonCancel: "bg-rose-500 hover:bg-rose-600 text-white rounded-md ",
        button3:
          "bg-white hover:bg-slate-300 text-black border-gray-500 rounded-md ",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
