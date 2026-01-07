import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', ...props }, ref) => {
    const variantClasses = {
      text: "rounded h-4 w-full",
      circular: "rounded-full",
      rectangular: "rounded-md"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-gray-200 dark:bg-gray-700",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton }
export default Skeleton
