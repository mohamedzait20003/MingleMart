import { useEffect, useRef, type ComponentProps } from "react"

import { cn } from "@/lib/utils/utils"

type ShakeProps = ComponentProps<"div"> & {
    /**
     * Increment to shake. A counter rather than a boolean, so two rejections in
     * a row are two shakes — a boolean that is already `true` says nothing.
     */
    signal: number
}

/**
 * Shakes its contents when `signal` changes.
 *
 * Reserved for a rejected submission: the form is still there, still filled in,
 * and the motion says "not that" without moving anything the user was about to
 * click. The class is added imperatively and removed on `animationend`, so the
 * animation can be retriggered without a React re-render fighting it.
 */
export function Shake({ className, signal, children, ...props }: Readonly<ShakeProps>) {
    const ref = useRef<HTMLDivElement>(null)
    const previous = useRef(signal)

    useEffect(() => {
        const node = ref.current
        // Nothing to react to on mount: the first render is not a rejection.
        if (!node || signal === previous.current) return
        previous.current = signal

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        const clear = () => delete node.dataset.shake
        node.addEventListener("animationend", clear, { once: true })

        // Force a reflow between removing and re-adding, or an identical
        // attribute value never restarts the animation.
        clear()
        void node.offsetWidth
        node.dataset.shake = ""

        return () => node.removeEventListener("animationend", clear)
    }, [signal])

    return (
        <div ref={ref} className={cn(className)} {...props}>
            {children}
        </div>
    )
}
