import type { ComponentProps } from "react"

import { cn } from "@/lib/utils/utils"

/** Which brand colours the field is mixed from. */
export type AuroraTone = "brand" | "sale" | "cool"

const TONE: Record<AuroraTone, [string, string, string]> = {
    brand: ["bg-brand-2/25", "bg-brand-3/25", "bg-primary/20"],
    sale: ["bg-sale/25", "bg-brand-1/25", "bg-warning/20"],
    cool: ["bg-chart-2/25", "bg-chart-3/20", "bg-brand-3/20"],
}

type AuroraProps = ComponentProps<"div"> & {
    tone?: AuroraTone
    /** Softens the whole field. Lower it when text has to sit on top. */
    intensity?: number
    /** Lay a fine dot grid over the blobs for a bit of texture. */
    grid?: boolean
}

/**
 * Decorative gradient field for section and page headers.
 *
 * Three blurred blobs that drift and breathe on separate cycles, so the
 * background never loops visibly. It is `aria-hidden` and `pointer-events-none`
 * throughout — nothing here is content, and it must never intercept a click.
 * The drift lives in CSS and disappears under reduced motion, leaving a still
 * gradient that looks deliberate rather than broken.
 */
export function Aurora({
    className,
    tone = "brand",
    intensity = 1,
    grid = false,
    style,
    ...props
}: Readonly<AuroraProps>) {
    const [one, two, three] = TONE[tone]

    return (
        <div
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
            style={{ ...style, opacity: intensity }}
            {...props}
        >
            <div
                data-float=""
                data-drift=""
                style={{
                    "--float-duration": "11s",
                    "--float-distance": "-26px",
                    "--drift-duration": "19s",
                    "--drift-x": "6%",
                    "--drift-scale": "1.15",
                }}
                className={cn("absolute -top-32 -left-24 size-[32rem] rounded-full blur-3xl", one)}
            />
            <div
                data-float=""
                data-drift=""
                style={{
                    "--float-duration": "13s",
                    "--float-distance": "22px",
                    "--float-delay": "1.4s",
                    "--drift-duration": "23s",
                    "--drift-x": "-5%",
                    "--drift-y": "4%",
                    "--drift-scale": "1.08",
                }}
                className={cn("absolute -top-24 -right-32 size-[28rem] rounded-full blur-3xl", two)}
            />
            <div
                data-float=""
                data-drift=""
                style={{
                    "--float-duration": "16s",
                    "--float-distance": "-18px",
                    "--float-delay": "2.6s",
                    "--drift-duration": "27s",
                    "--drift-y": "-5%",
                    "--drift-scale": "1.1",
                }}
                className={cn(
                    "absolute -bottom-40 left-1/3 size-[26rem] rounded-full blur-3xl",
                    three
                )}
            />

            {grid && (
                <div
                    className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_75%)]"
                />
            )}
        </div>
    )
}
