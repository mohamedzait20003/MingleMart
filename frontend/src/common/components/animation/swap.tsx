import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils/utils"

type SwapProps = Omit<ComponentProps<"div">, "children"> & {
    /** Changing this replays the entrance. Use the state's name, not an index. */
    swapKey: string
    children: ReactNode
}

/**
 * Crossfades whatever replaces its contents.
 *
 * For one container that shows different things over time — verifying, then
 * verified, then a way onward. Without this the third state simply appears
 * where the first one was, which reads as a glitch rather than as progress.
 *
 * Entrance only: React has already removed the old subtree by the time this
 * renders, so there is nothing left to animate out. Keying the inner element
 * is what makes React replace it rather than patch it, which is what restarts
 * the animation.
 */
export function Swap({ className, swapKey, children, ...props }: Readonly<SwapProps>) {
    return (
        <div className={cn(className)} {...props}>
            <div key={swapKey} data-swap-in="">
                {children}
            </div>
        </div>
    )
}
