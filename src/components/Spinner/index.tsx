import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "../../utils/cn"
import spinnerStyles from "./Spinner.module.css"
import skeletonStyles from "./Skeleton.module.css"

// Spinner Component
export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
    ({ className, size = 'md', ...props }, ref) => {
        return (
            <Loader2
                ref={ref}
                className={cn(
                    spinnerStyles.spinner,
                    spinnerStyles[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Spinner.displayName = "Spinner"

// Skeleton Component
export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(skeletonStyles.skeleton, className)}
                {...props}
            />
        )
    }
)
Skeleton.displayName = "Skeleton"

export { Spinner, Skeleton }