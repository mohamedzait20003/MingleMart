import type { ReactNode } from "react"

import { DrawMark, type MarkKind } from "@/common/components/animation/draw-mark"
import { Card, CardContent } from "@/common/components/ui/card"
import { Reveal } from "@/common/components/animation/reveal"

type Tone = "success" | "destructive" | "primary" | "info"

type AuthOutcomeProps = {
    kind: MarkKind
    tone: Tone
    /** What the glyph means, read out in place of the drawing. */
    markLabel: string
    title: string
    description: string
    children?: ReactNode
    /** Buttons and links, stacked full width under the copy. */
    actions?: ReactNode
}

/**
 * The end of a flow: verified, reset, or failed.
 *
 * One shape for all three outcomes so the difference between them is carried by
 * the glyph, the colour and the words — not by a different page each time. The
 * heading is the `<h1>`: on these screens the outcome is the entire content.
 */
export function AuthOutcome({
    kind,
    tone,
    markLabel,
    title,
    description,
    children,
    actions,
}: Readonly<AuthOutcomeProps>) {
    return (
        <Reveal>
            <Card className="border border-border bg-card/85 text-center shadow-xl backdrop-blur [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
                <CardContent className="flex flex-col items-center gap-5">
                    <DrawMark kind={kind} tone={tone} label={markLabel} />

                    <div className="flex flex-col gap-2">
                        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
                            {title}
                        </h1>
                        <p className="text-pretty text-muted-foreground">{description}</p>
                    </div>

                    {children}

                    {actions && <div className="flex w-full flex-col gap-3">{actions}</div>}
                </CardContent>
            </Card>
        </Reveal>
    )
}
