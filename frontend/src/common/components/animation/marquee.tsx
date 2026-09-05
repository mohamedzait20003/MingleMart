import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils/utils"

type MarqueeProps = ComponentProps<"div"> & {
    children: ReactNode
    /** Seconds for one full pass. Longer is slower and calmer. */
    duration?: number
    reverse?: boolean
    /** Stop while the pointer rests on the strip, so items stay readable. */
    pauseOnHover?: boolean
    /** Fade the strip out at both ends instead of cutting it off. */
    fade?: boolean
}

/**
 * Seamless horizontal ticker.
 *
 * The track holds two identical copies and slides exactly half its width, so the
 * loop point is invisible. The copy is `aria-hidden`, so screen readers hear the
 * list once. Under `prefers-reduced-motion` the CSS drops the animation and the
 * strip simply sits still.
 */
export function Marquee({
    className,
    children,
    duration = 32,
    reverse = false,
    pauseOnHover = true,
    fade = true,
    style,
    ...props
}: Readonly<MarqueeProps>) {
    return (
        <div
            data-marquee=""
            data-fade={fade ? "" : undefined}
            data-pause-on-hover={pauseOnHover ? "" : undefined}
            className={cn("group/marquee relative flex overflow-hidden", className)}
            style={{
                ...style,
                "--marquee-duration": `${duration}s`,
                "--marquee-direction": reverse ? "reverse" : "normal",
            }}
            {...props}
        >
            <div data-marquee-track="" className="flex w-max shrink-0 items-center">
                {children}
            </div>
            <div
                data-marquee-track=""
                aria-hidden="true"
                className="flex w-max shrink-0 items-center"
            >
                {children}
            </div>
        </div>
    )
}
