import type { ComponentType, ReactNode, SVGProps } from "react"

import { Card, CardContent } from "@/common/components/ui/card"
import { Reveal } from "@/common/components/animation/reveal"
import { cn } from "@/lib/utils/utils"

type AuthCardProps = {
    /** Sits above the title as a small, tone-setting glyph. */
    icon?: ComponentType<SVGProps<SVGSVGElement>>
    title: string
    description: string
    children: ReactNode
    /** Rendered below the card, outside its surface. */
    footer?: ReactNode
    className?: string
}

/**
 * The form surface every auth page shares.
 *
 * The heading is a real `<h1>` and lives inside the card rather than floating
 * above it, so the page has exactly one thing to look at. The card enters as a
 * single element rather than staggering its fields — a form that assembles
 * itself in front of you is slower to start filling in.
 */
export function AuthCard({
    icon: Icon,
    title,
    description,
    children,
    footer,
    className,
}: Readonly<AuthCardProps>) {
    return (
        <>
            <Reveal>
                <Card
                    className={cn(
                        "border border-border bg-card/85 shadow-xl backdrop-blur [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]",
                        className
                    )}
                >
                    <CardContent className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            {Icon && (
                                <span
                                    aria-hidden="true"
                                    className="mb-2 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                                >
                                    <Icon className="size-6" />
                                </span>
                            )}
                            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
                                {title}
                            </h1>
                            <p className="text-pretty text-muted-foreground">{description}</p>
                        </div>

                        {children}
                    </CardContent>
                </Card>
            </Reveal>

            {footer && (
                <Reveal delay={120} className="mt-6 text-center text-sm">
                    {footer}
                </Reveal>
            )}
        </>
    )
}
