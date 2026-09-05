import { useEffect, useRef } from "react"

interface RevealOptions {
    repeat?: boolean
    rootMargin?: string
}

export function useRevealOnScroll<T extends HTMLElement>({
    repeat = false,
    rootMargin = "0px 0px -12% 0px",
}: RevealOptions = {}) {
    const ref = useRef<T>(null)

    useEffect(() => {
        const node = ref.current
        if (!node)
            return

        if (typeof IntersectionObserver === "undefined") {
            node.dataset.visible = ""
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    node.dataset.visible = ""
                    if (!repeat) observer.disconnect()
                } else if (repeat) {
                    delete node.dataset.visible
                }
            },
            { rootMargin }
        )

        observer.observe(node)
        return () => observer.disconnect()
    }, [repeat, rootMargin])

    return ref
}
