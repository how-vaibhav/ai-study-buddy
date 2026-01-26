"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* ================= ROOT ================= */

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        `
        relative flex w-full items-center
        rounded-xl border
        bg-white/70 dark:bg-[#0b1020]/60
        backdrop-blur-xl

        border-border/60
        shadow-sm
        transition-all duration-200

        hover:border-border
        has-[[data-slot=input-group-control]:focus-visible]:
          border-primary/60
        has-[[data-slot=input-group-control]:focus-visible]:
          ring-4 ring-primary/15

        has-[[data-slot][aria-invalid=true]]:
          border-destructive/60
        has-[[data-slot][aria-invalid=true]]:
          ring-4 ring-destructive/20

        group/input-group
        `,
        "h-10 has-[>textarea]:h-auto",
        className,
      )}
      {...props}
    />
  );
}

/* ================= ADDON ================= */

const inputGroupAddonVariants = cva(
  `
  text-muted-foreground
  flex items-center gap-2
  px-3 text-sm font-medium
  select-none
  [&>svg:not([class*="size-"])]:size-4
  group-hover/input-group:text-foreground
  transition-colors
  `,
  {
    variants: {
      align: {
        "inline-start": "order-first",
        "inline-end": "order-last",
        "block-start":
          "order-first w-full justify-start border-b border-border/40 py-2",
        "block-end":
          "order-last w-full justify-start border-t border-border/40 py-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        e.currentTarget.parentElement
          ?.querySelector<HTMLInputElement>("input, textarea")
          ?.focus();
      }}
      {...props}
    />
  );
}

/* ================= BUTTON ================= */

const inputGroupButtonVariants = cva(
  `
  shadow-none
  text-sm
  transition-colors
  `,
  {
    variants: {
      size: {
        xs: "h-7 px-2 rounded-md",
        sm: "h-8 px-2.5 rounded-md",
        "icon-xs": "size-7 p-0 rounded-md",
        "icon-sm": "size-8 p-0 rounded-md",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      variant={variant}
      data-size={size}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

/* ================= TEXT ================= */

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/* ================= INPUT ================= */

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        `
        flex-1
        rounded-none
        border-0
        bg-transparent
        shadow-none
        px-3
        focus-visible:ring-0
        placeholder:text-muted-foreground/70
        `,
        className,
      )}
      {...props}
    />
  );
}

/* ================= TEXTAREA ================= */

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        `
        flex-1
        resize-none
        rounded-none
        border-0
        bg-transparent
        px-3 py-3
        shadow-none
        focus-visible:ring-0
        placeholder:text-muted-foreground/70
        `,
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
