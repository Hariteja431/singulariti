import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center font-sans leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary px-2 py-1 rounded-[4px] text-[11px] font-medium",
        pro: "bg-accent/10 text-accent px-2 py-1 rounded-[4px] text-[11px] font-medium",
        outline: "border border-border text-slate px-2 py-1 rounded-[4px] text-[11px] font-medium",
        pill: "bg-surface border border-border text-slate px-4 py-2 rounded-pill hover:border-slate transition-colors text-[11px] font-medium",
        "pill-active": "bg-ink text-surface px-4 py-2 rounded-pill text-[11px] font-medium",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 rounded-full px-2.5 py-0.5 text-xs font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  // If variant is 'pill' or 'pill-active', render as span for backward compatibility
  const Comp = "span"
  return (
    <Comp className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
