import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        // Primary - Sage Green (main CTA)
        default: "bg-sage-500 text-white hover:bg-sage-600 shadow-sm hover:shadow-md",
        // Warm - Peach (secondary CTA, warmth)
        warm: "bg-peach-400 text-charcoal hover:bg-peach-500 shadow-sm hover:shadow-md",
        // Destructive
        destructive: "bg-red-500 text-white hover:bg-red-600",
        // Outline - Sage border
        outline: "border-[1.5px] border-sage-500 bg-transparent text-sage-600 hover:bg-sage-50",
        // Outline warm - Peach border
        "outline-warm": "border-[1.5px] border-peach-400 bg-transparent text-peach-600 hover:bg-peach-50",
        // Secondary - Light sage background
        secondary: "bg-sage-50 text-sage-700 hover:bg-sage-100",
        // Ghost - Subtle hover
        ghost: "hover:bg-surface text-text-muted hover:text-text",
        // Link style
        link: "text-sage-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
