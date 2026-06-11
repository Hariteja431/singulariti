import * as React from "react"
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from './Badge'

import { cn } from "@/lib/utils"

interface ExistingCardProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  href?: string
  badge?: {
    text: string
    variant: 'default' | 'pro' | 'outline'
  }
}

type CardProps = React.HTMLAttributes<HTMLDivElement> & ExistingCardProps

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, title, description, icon, href, badge, children, ...props }, ref) => {
  // If 'href' is present, render the existing tool navigation card layout
  if (href) {
    return (
      <Link href={href} className="group block h-full">
        <div className="h-full p-6 bg-surface border border-border rounded-xl transition-all duration-150 ease-out hover:border-slate hover:shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            {icon}
            {badge && (
              <Badge variant={badge.variant}>{badge.text}</Badge>
            )}
          </div>
          
          <h3 className="font-display font-bold text-[17px] text-ink mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="font-sans text-[13px] text-slate line-clamp-2 flex-grow mb-4">
            {description}
          </p>
          
          <div className="mt-auto flex items-center text-[13px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
            Open Tool <ArrowRight className="ml-1 w-4 h-4" />
          </div>
        </div>
      </Link>
    )
  }

  // Otherwise, render the standard shadcn container card
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
