import type { ComponentProps, ElementType } from "react"

import { cn } from "@/lib/utils/utils"
import { useRevealOnScroll } from "@/lib/hooks/useReveal"

type RevealProps = ComponentProps<"div"> & {
    delay?: number
    as?: ElementType
    repeat?: boolean
}

/** Fades and lifts a single element into place the first time it is scrolled to. */
export function Reveal({
    className,
    delay = 0,
    as: Tag = "div",
    repeat,
    style,
    ...props
}: Readonly<RevealProps>) {
    const ref = useRevealOnScroll<HTMLDivElement>({ repeat })

    return (
        <Tag
            ref={ref}
            data-reveal=""
            style={delay ? { ...style, "--reveal-delay": `${delay}ms` } : style}
            className={cn(className)}
            {...props}
        />
    )
}

type StaggerProps = ComponentProps<"div"> & {
    step?: number
    delay?: number
    as?: ElementType
    repeat?: boolean
}

export function Stagger({
    className,
    step = 60,
    delay = 0,
    as: Tag = "div",
    repeat,
    style,
    ...props
}: Readonly<StaggerProps>) {
    const ref = useRevealOnScroll<HTMLDivElement>({ repeat })

    return (
        <Tag
            ref={ref}
            data-stagger=""
            style={{
                ...style,
                "--stagger-step": `${step}ms`,
                ...(delay ? { "--reveal-delay": `${delay}ms` } : {}),
            }}
            className={cn(className)}
            {...props}
        />
    )
}
