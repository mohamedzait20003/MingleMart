import type { ComponentProps, ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils/utils"
import { Reveal } from "@/common/components/animation/reveal"

/** Page-level band. Owns the vertical rhythm so sections cannot drift apart. */
export function Section({
    className,
    children,
    ...props
}: Readonly<ComponentProps<"section">>) {
    return (
        <section className={cn("py-16 sm:py-20 lg:py-28", className)} {...props}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </section>
    )
}

type SectionHeadingProps = {
    eyebrow?: ReactNode
    title: ReactNode
    description?: string
    /** Optional "see everything" escape hatch, aligned opposite the title on wide screens. */
    action?: { to: string; label: string }
    align?: "start" | "center"
    /** Lets a caller sit the heading in its own row, e.g. beside a live timer. */
    className?: string
}

export function SectionHeading({
    eyebrow,
    title,
    description,
    action,
    align = "center",
    className,
}: Readonly<SectionHeadingProps>) {
    const centered = align === "center"

    return (
        <Reveal
            className={cn(
                "mb-10 flex flex-col gap-4 sm:mb-14",
                centered
                    ? "items-center text-center"
                    : "sm:flex-row sm:items-end sm:justify-between",
                className
            )}
        >
            <div className={cn("flex flex-col gap-3", centered && "items-center")}>
                {eyebrow && (
                    <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-primary uppercase">
                        <span aria-hidden="true" className="h-px w-6 bg-primary/50" />
                        {eyebrow}
                    </span>
                )}
                <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                    {title}
                </h2>
                {description && (
                    <p
                        className={cn(
                            "max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg",
                            centered && "mx-auto"
                        )}
                    >
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <Link
                    to={action.to}
                    className="group/act inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary transition-colors outline-none hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                    {action.label}
                    <ArrowRightIcon
                        aria-hidden="true"
                        className="size-4 transition-transform duration-200 group-hover/act:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/act:translate-x-0"
                    />
                </Link>
            )}
        </Reveal>
    )
}
