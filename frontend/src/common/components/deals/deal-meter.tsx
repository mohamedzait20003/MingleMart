import { Progress } from "@/common/components/ui/progress"
import { cn } from "@/lib/utils/utils"

/** Below this many units the count switches to the urgent treatment. */
const LOW = 12

/**
 * How much of a deal's allocation is gone.
 *
 * The bar carries `role="progressbar"` semantics from the Base UI primitive,
 * and the same numbers are written out in text beside it — scarcity is the
 * whole reason this page converts, so it cannot be readable only as a colour.
 */
export function DealMeter({
    claimed,
    left,
    className,
}: Readonly<{ claimed: number; left: number; className?: string }>) {
    const scarce = left <= LOW

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-semibold tabular-nums">{claimed}% claimed</span>
                <span
                    className={cn(
                        "inline-flex items-center gap-1.5 font-semibold tabular-nums",
                        scarce ? "text-sale" : "text-muted-foreground"
                    )}
                >
                    {scarce && (
                        <span
                            aria-hidden="true"
                            data-pulse=""
                            className="size-1.5 rounded-full bg-sale"
                        />
                    )}
                    Only {left} left
                </span>
            </div>

            <Progress
                value={claimed}
                aria-label="Share of this deal already claimed"
                className={cn(
                    "gap-0",
                    "[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-foreground/10",
                    "[&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-brand-2 [&_[data-slot=progress-indicator]]:to-brand-3"
                )}
            />
        </div>
    )
}
