import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `
  inline-flex items-center justify-center gap-2
  whitespace-nowrap rounded-lg
  text-sm font-semibold
  transition-all duration-200
  select-none

  disabled:pointer-events-none disabled:opacity-50

  [&_svg]:pointer-events-none
  [&_svg:not([class*='size-'])]:size-4
  [&_svg]:shrink-0

  outline-none
  focus-visible:ring-4 focus-visible:ring-ring/30
  focus-visible:border-ring

  aria-invalid:ring-destructive/20
  dark:aria-invalid:ring-destructive/40
  aria-invalid:border-destructive
  `,
  {
    variants: {
      variant: {
        default: `
          bg-gradient-to-br from-indigo-600 to-purple-600
          text-white
          shadow-md
          hover:shadow-lg
          hover:-translate-y-[1px]
          active:translate-y-0
        `,
        destructive: `
          bg-destructive text-white
          shadow-md
          hover:bg-destructive/90
          focus-visible:ring-destructive/30
        `,
        outline: `
          border border-border
          bg-white/70 dark:bg-[#0b1020]/60
          backdrop-blur-xl
          shadow-sm
          hover:bg-accent hover:text-accent-foreground
        `,
        secondary: `
          bg-secondary text-secondary-foreground
          hover:bg-secondary/80
        `,
        ghost: `
          bg-transparent
          hover:bg-accent/70 hover:text-accent-foreground
          dark:hover:bg-accent/40
        `,
        link: `
          text-primary underline-offset-4
          hover:underline
        `,
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
