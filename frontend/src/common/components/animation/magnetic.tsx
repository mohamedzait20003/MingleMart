import { useEffect, useRef, type ComponentProps, type ElementType } from "react"

import { cn } from "@/lib/utils/utils"

type MagneticProps = ComponentProps<"div"> & {
    /** Share of the pointer offset the element follows. Above ~0.5 it detaches from its hit area. */
    strength?: number
    /** Cap on the travel, in px, so the target never slides off its own tap area. */
    limit?: number
    as?: ElementType
}

/**
 * Nudges an element toward the pointer while it is hovered.
 *
 * Reserved for a page's single primary action: the pull is what makes the
 * button feel like the thing you were already reaching for. The travel is
 * capped well inside the target's own bounds, so the element never runs away
 * from the click that is chasing it, and the whole effect is skipped on touch
 * and under reduced motion.
 */
export function Magnetic({
    className,
    strength = 0.28,
    limit = 10,
    as: Tag = "div",
    children,
    ...props
}: Readonly<MagneticProps>) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const node = ref.current
        if (!node || typeof window === "undefined") return

        const fine = window.matchMedia("(pointer: fine)")
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)")
        if (!fine.matches || calm.matches) return

        let frame = 0
        let pending: { x: number; y: number } | null = null

        const clamp = (value: number) => Math.max(-limit, Math.min(limit, value))

        const paint = () => {
            frame = 0
            if (!pending) return
            node.style.setProperty("--magnet-x", `${clamp(pending.x)}px`)
            node.style.setProperty("--magnet-y", `${clamp(pending.y)}px`)
        }

        const onMove = (event: PointerEvent) => {
            const box = node.getBoundingClientRect()
            pending = {
                x: (event.clientX - (box.left + box.width / 2)) * strength,
                y: (event.clientY - (box.top + box.height / 2)) * strength,
            }
            if (!frame) frame = requestAnimationFrame(paint)
        }

        const onEnter = () => {
            node.dataset.tracking = ""
        }

        const onLeave = () => {
            delete node.dataset.tracking
            node.style.removeProperty("--magnet-x")
            node.style.removeProperty("--magnet-y")
        }

        node.addEventListener("pointerenter", onEnter)
        node.addEventListener("pointermove", onMove)
        node.addEventListener("pointerleave", onLeave)

        return () => {
            node.removeEventListener("pointerenter", onEnter)
            node.removeEventListener("pointermove", onMove)
            node.removeEventListener("pointerleave", onLeave)
            cancelAnimationFrame(frame)
        }
    }, [strength, limit])

    return (
        <Tag ref={ref} data-magnetic="" className={cn("inline-flex", className)} {...props}>
            {children}
        </Tag>
    )
}
