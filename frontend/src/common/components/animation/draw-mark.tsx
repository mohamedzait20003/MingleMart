import type { ComponentProps } from "react"

import { cn } from "@/lib/utils/utils"

/** Which glyph is drawn inside the ring. */
export type MarkKind = "check" | "cross" | "mail"

type Glyph = { d: string; length: number }

/**
 * Path length is declared rather than measured. `getTotalLength()` only exists
 * once the node is in a document, and the server has no document — hardcoding
 * it keeps the markup identical on both sides of hydration.
 */
const GLYPH: Record<MarkKind, Glyph> = {
    check: { d: "M16 25.5 22 31.5 34 18.5", length: 34 },
    cross: { d: "M18 18 32 32 M32 18 18 32", length: 40 },
    mail: { d: "M15 19h20v12H15z M15 19l10 8 10-8", length: 90 },
}

const TONE: Record<string, string> = {
    success: "text-success bg-success/12 ring-success/25",
    destructive: "text-destructive bg-destructive/12 ring-destructive/25",
    primary: "text-primary bg-primary/12 ring-primary/25",
    info: "text-info bg-info/12 ring-info/25",
}

type DrawMarkProps = Omit<ComponentProps<"span">, "children"> & {
    kind?: MarkKind
    tone?: keyof typeof TONE
    /** Hold before the stroke starts, in ms. */
    delay?: number
    /**
     * What this outcome means, for anyone who cannot see it. Required, because
     * a tick is the entire message on a confirmation screen.
     */
    label: string
}

/**
 * The outcome glyph on a confirmation screen.
 *
 * The ring scales in and the stroke draws itself, which turns "it worked" into
 * something the eye follows rather than something that was simply already
 * there. Under reduced motion the CSS leaves the finished mark in place, so the
 * screen still says what happened — it just says it instantly.
 */
export function DrawMark({
    className,
    kind = "check",
    tone = "success",
    delay = 0,
    label,
    ...props
}: Readonly<DrawMarkProps>) {
    const { d, length } = GLYPH[kind]

    return (
        <span
            data-mark-ring=""
            className={cn(
                "inline-flex size-20 items-center justify-center rounded-full ring-8",
                TONE[tone],
                className
            )}
            {...props}
        >
            <svg
                viewBox="0 0 50 50"
                fill="none"
                role="img"
                aria-label={label}
                className="size-12"
            >
                <path
                    data-draw-mark=""
                    d={d}
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        "--mark-length": length,
                        "--mark-delay": `${delay + 140}ms`,
                    }}
                />
            </svg>
        </span>
    )
}
