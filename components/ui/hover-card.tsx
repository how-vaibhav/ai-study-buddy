"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils";

/* ================= ROOT ================= */

function HoverCard(
  props: React.ComponentProps<typeof HoverCardPrimitive.Root>,
) {
  return <HoverCardPrimitive.Root openDelay={120} closeDelay={80} {...props} />;
}

/* ================= TRIGGER ================= */

function HoverCardTrigger(
  props: React.ComponentProps<typeof HoverCardPrimitive.Trigger>,
) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

/* ================= CONTENT ================= */

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          `
          z-[120]
          w-64
          rounded-xl
          border border-white/20 dark:border-white/10
          bg-white/80 dark:bg-[#0b1020]/85
          backdrop-blur-xl
          shadow-xl shadow-black/10 dark:shadow-black/40

          text-popover-foreground
          p-4

          origin-[var(--radix-hover-card-content-transform-origin)]

          data-[state=open]:animate-hoverCardIn
          data-[state=closed]:animate-hoverCardOut
          `,
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
