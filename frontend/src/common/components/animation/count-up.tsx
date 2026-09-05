import { useEffect, useRef, type ComponentProps } from "react"

import { cn } from "@/lib/utils/utils"

type CountUpProps = Omit<ComponentProps<"span">, "children"> & {
    to: number
    /** Milliseconds for the full run. */
    duration?: number
    /** Rendered before and after the number, e.g. `$` and `+`. */
    prefix?: string
    suffix?: string
    /** Decimal places to keep, for values like a 4.9 rating. */
    decimals?: number
}

/**
 * Counts up to `to` the first time it is scrolled into view.
 *
 * Renders the final value in markup, so the real number is what gets
 * server-rendered, indexed, and shown when JS or animation is unavailable. The
 * running value is written straight to the DOM node instead of through state —
 * a 60fps counter has no business re-rendering React sixty times a second.
 */
export function CountUp({
    to,
    duration = 1400,
    prefix = "",
    suffix = "",
    decimals = 0,
    className,
    ...props
}: Readonly<CountUpProps>) {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        const format = (value: number) =>
            prefix +
            value.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }) +
            suffix

        // Leave the final value in place when motion is unwelcome or unobservable.
        if (
            typeof IntersectionObserver === "undefined" ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return
        }

        node.textContent = format(0)
        let frame = 0

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            observer.disconnect()

            const started = performance.now()
            const tick = (now: number) => {
                const progress = Math.min(1, (now - started) / duration)
                // Ease-out cubic: quick off the mark, settles gently on the value.
                const eased = 1 - Math.pow(1 - progress, 3)
                node.textContent = format(to * eased)
                if (progress < 1) frame = requestAnimationFrame(tick)
            }
            frame = requestAnimationFrame(tick)
        })

        observer.observe(node)
        return () => {
            observer.disconnect()
            cancelAnimationFrame(frame)
            node.textContent = format(to)
        }
    }, [to, duration, prefix, suffix, decimals])

    return (
        <span ref={ref} className={cn("tabular-nums", className)} {...props}>
            {prefix}
            {to.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}
            {suffix}
        </span>
    )
}
