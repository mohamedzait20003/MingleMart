import type { ComponentProps, ComponentType, ReactNode, SVGProps } from "react"
import { Link } from "react-router-dom"

import { Card, CardContent } from "@/common/components/ui/card"
import { Reveal } from "@/common/components/animation/reveal"
import { cn } from "@/lib/utils/utils"

type ErrorPageProps = {
    status: number
    icon: ComponentType<SVGProps<SVGSVGElement>>
    title: string
    description: string
    actions?: ReactNode
}

const actionBase = cn(
    "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 font-semibold",
    "transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
)

/** The way out of a dead end. Exactly one per page carries the primary weight. */
export function ErrorPrimaryLink({ className, ...props }: Readonly<ComponentProps<typeof Link>>) {
    return (
        <Link
            className={cn(actionBase, "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90", className)}
            {...props}
        />
    )
}

export function ErrorSecondaryLink({ className, ...props }: Readonly<ComponentProps<typeof Link>>) {
    return <Link className={cn(actionBase, "border border-border hover:bg-muted", className)} {...props} />
}

/**
 * One shape for every dead end.
 *
 * A 404 and a 403 differ only in what happened and where to go next, so they
 * share a page and carry the difference in the words. The heading is the `<h1>`:
 * on these screens the outcome is the entire content.
 */
export function ErrorPage({ status, icon: Icon, title, description, actions }: Readonly<ErrorPageProps>) {
    return (
        <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <Reveal>
                    <Card className="border border-border bg-card/85 text-center shadow-xl backdrop-blur [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
                        <CardContent className="flex flex-col items-center gap-5">
                            <span className="inline-flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground ring-8 ring-muted/40">
                                <Icon className="size-9" aria-hidden="true" />
                            </span>

                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase tabular-nums">
                                    Error {status}
                                </p>
                                <h1 className="font-heading text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
                                    {title}
                                </h1>
                                <p className="text-pretty text-muted-foreground">{description}</p>
                            </div>

                            {actions && <div className="flex w-full flex-col gap-3">{actions}</div>}
                        </CardContent>
                    </Card>
                </Reveal>
            </div>
        </div>
    )
}
