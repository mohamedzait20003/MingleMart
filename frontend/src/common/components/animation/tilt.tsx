import { useEffect, useRef, type ComponentProps, type ElementType } from "react"

import { cn } from "@/lib/utils/utils"

type TiltProps = ComponentProps<"div"> & {
    /** Maximum rotation on either axis, in degrees. Past ~10 it stops reading as a card. */
    max?: number
    /** Lift applied while the pointer is over the surface. */
    scale?: number
    /** Sweep a soft highlight across the surface under the pointer. */
    glare?: boolean
    as?: ElementType
}

/**
 * Tilts a surface toward the pointer.
 *
 * The rotation is written to three custom properties and composed by a single
 * CSS `transform` (see `index.css`), so a move costs one style write on one
 * element and never touches layout. Nothing runs unless the device actually has
 * a fine pointer and the visitor has not asked for reduced motion — on a phone,
 * or with motion turned down, this is an ordinary `<div>`.
 */
export function Tilt({
    className,
    max = 7,
    scale = 1.02,
    glare = true,
    as: Tag = "div",
    children,
    ...props
}: Readonly<TiltProps>) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const node = ref.current
        if (!node || typeof window === "undefined") return

        const fine = window.matchMedia("(pointer: fine)")
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)")
        if (!fine.matches || calm.matches) return

        let frame = 0
        let pending: { x: number; y: number } | null = null

        const paint = () => {
            frame = 0
            if (!pending) return
            const { x, y } = pending
            node.style.setProperty("--tilt-y", `${(x - 0.5) * 2 * max}deg`)
            node.style.setProperty("--tilt-x", `${(0.5 - y) * 2 * max}deg`)
            node.style.setProperty("--pointer-x", `${x * 100}%`)
            node.style.setProperty("--pointer-y", `${y * 100}%`)
        }

        const onMove = (event: PointerEvent) => {
            const box = node.getBoundingClientRect()
            pending = {
                x: (event.clientX - box.left) / box.width,
                y: (event.clientY - box.top) / box.height,
            }
            // Coalesce to one write per frame: pointermove fires far faster than 60Hz.
            if (!frame) frame = requestAnimationFrame(paint)
        }

        const onEnter = () => {
            node.dataset.tracking = ""
            node.style.setProperty("--tilt-scale", String(scale))
        }

        const onLeave = () => {
            delete node.dataset.tracking
            node.style.removeProperty("--tilt-x")
            node.style.removeProperty("--tilt-y")
            node.style.removeProperty("--tilt-scale")
        }

        node.addEventListener("pointerenter", onEnter)
        node.addEventListener("pointermove", onMove)
        node.addEventListener("pointerleave", onLeave)
        // A card can also be reached by keyboard; drop the tilt rather than
        // leaving a stale rotation behind when focus moves on.
        node.addEventListener("blur", onLeave, true)

        return () => {
            node.removeEventListener("pointerenter", onEnter)
            node.removeEventListener("pointermove", onMove)
            node.removeEventListener("pointerleave", onLeave)
            node.removeEventListener("blur", onLeave, true)
            cancelAnimationFrame(frame)
        }
    }, [max, scale])

    return (
        <Tag ref={ref} data-tilt="" className={cn("relative", className)} {...props}>
            {children}
            {glare && (
                <span
                    aria-hidden="true"
                    data-tilt-glare=""
                    className="pointer-events-none absolute inset-0 z-1 rounded-[inherit]"
                />
            )}
        </Tag>
    )
}
