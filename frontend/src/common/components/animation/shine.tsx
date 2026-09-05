import type { ComponentProps } from "react"

import { cn } from "@/lib/utils/utils"

type ShineProps = Omit<ComponentProps<"span">, "children"> & {
    /**
     * `auto` sweeps on a loop; `hover` waits for the host to be hovered or
     * focused. `hover` needs `data-shine-host` on the positioned ancestor.
     */
    mode?: "auto" | "hover"
    /** Seconds for one pass. */
    duration?: number
    delay?: number
}

/**
 * A gloss that sweeps across whatever it is laid over.
 *
 * Purely an overlay: it fills its positioned ancestor, inherits that ancestor's
 * corner radius, and never takes a pointer event. The sweep colour comes from
 * `currentColor`, so it is set with a text utility and stays on-token in both
 * themes. Under reduced motion the CSS drops the animation and the bar simply
 * never appears.
 */
export function Shine({
    className,
    mode = "auto",
    duration = 2.8,
    delay = 0,
    style,
    ...props
}: Readonly<ShineProps>) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
                className
            )}
            {...props}
        >
            <span
                data-shine={mode}
                style={{
                    ...style,
                    "--shine-duration": `${duration}s`,
                    "--shine-delay": `${delay}ms`,
                }}
                className="absolute inset-y-0 -left-1/4 w-1/4 bg-gradient-to-r from-transparent via-current to-transparent opacity-0"
            />
        </span>
    )
}
