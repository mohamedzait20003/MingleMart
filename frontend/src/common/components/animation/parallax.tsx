import { useEffect, useRef, type ComponentProps, type ElementType } from "react"

import { cn } from "@/lib/utils/utils"

type ParallaxProps = ComponentProps<"div"> & {
    /**
     * How far the element lags the page, as a share of its distance from the
     * viewport centre. Keep it under ~0.2: past that the drift outruns the
     * scroll and reads as a bug.
     */
    speed?: number
    as?: ElementType
}

/**
 * Drifts an element against the scroll.
 *
 * Only elements currently on screen are tracked, the scroll listener is passive,
 * and the offset is applied through one custom property per frame, so the whole
 * effect costs a single compositor-only transform. Off under reduced motion,
 * where the element just sits where the layout put it.
 */
export function Parallax({
    className,
    speed = 0.12,
    as: Tag = "div",
    children,
    ...props
}: Readonly<ParallaxProps>) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const node = ref.current
        if (!node || typeof window === "undefined") return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        let frame = 0
        let visible = false

        const paint = () => {
            frame = 0
            const box = node.getBoundingClientRect()
            const fromCentre = box.top + box.height / 2 - window.innerHeight / 2
            node.style.setProperty("--parallax-y", `${(-fromCentre * speed).toFixed(2)}px`)
        }

        const onScroll = () => {
            if (visible && !frame) frame = requestAnimationFrame(paint)
        }

        // Nothing is measured while the element is off screen, so a long page
        // with several of these still only pays for the ones in view.
        const observer =
            typeof IntersectionObserver === "undefined"
                ? null
                : new IntersectionObserver(([entry]) => {
                      visible = entry.isIntersecting
                      if (visible) onScroll()
                  })

        if (observer) observer.observe(node)
        else visible = true

        paint()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)

        return () => {
            observer?.disconnect()
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
            cancelAnimationFrame(frame)
            node.style.removeProperty("--parallax-y")
        }
    }, [speed])

    return (
        <Tag ref={ref} data-parallax="" className={cn(className)} {...props}>
            {children}
        </Tag>
    )
}
