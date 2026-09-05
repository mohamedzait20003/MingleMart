import type { ReactNode } from "react"
import { Link } from "react-router-dom"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/common/components/ui/breadcrumb"
import { Aurora, type AuroraTone } from "@/common/components/animation/aurora"
import { Parallax } from "@/common/components/animation/parallax"
import { Reveal } from "@/common/components/animation/reveal"
import { cn } from "@/lib/utils/utils"

type PageHeroProps = {
    eyebrow?: ReactNode
    title: ReactNode
    /** Plain-text label for the breadcrumb, when the title carries markup. */
    crumb?: string
    description: string
    /** Small print under the copy, e.g. an effective date. */
    meta?: ReactNode
    /** Buttons or links, rendered after the copy. */
    actions?: ReactNode
    tone?: AuroraTone
    /** Wide pages centre the copy; a legal document reads better left-aligned. */
    align?: "start" | "center"
}

/**
 * The header every company page opens with.
 *
 * One component rather than four hand-built banners, because these four pages
 * are the ones a visitor moves between — About to Careers, Terms to Privacy —
 * and the seam shows immediately if the headers do not match.
 *
 * The breadcrumb link is relative: these routes are mounted under the site
 * root, under a customer's own path, and under admin, so a hard-coded "/" would
 * throw a signed-in visitor out of their section of the site.
 */
export function PageHero({
    eyebrow,
    title,
    crumb,
    description,
    meta,
    actions,
    tone = "brand",
    align = "start",
}: Readonly<PageHeroProps>) {
    const centered = align === "center"

    return (
        <section className="relative overflow-hidden border-b border-border">
            <Parallax speed={0.05} className="absolute inset-0 -z-1">
                <Aurora tone={tone} intensity={0.85} grid />
            </Parallax>

            <div className="mx-auto max-w-7xl px-4 pt-6 pb-14 sm:px-6 lg:px-8 lg:pt-8 lg:pb-20">
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                render={<Link to=".." relative="path" />}
                                className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                            >
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium">{crumb ?? title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div
                    className={cn(
                        "flex flex-col gap-4",
                        centered && "mx-auto max-w-3xl items-center text-center"
                    )}
                >
                    {eyebrow && (
                        <Reveal
                            as="span"
                            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-primary uppercase"
                        >
                            <span aria-hidden="true" className="h-px w-6 bg-primary/50" />
                            {eyebrow}
                        </Reveal>
                    )}

                    <Reveal
                        delay={60}
                        as="h1"
                        className="font-heading text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
                    >
                        {title}
                    </Reveal>

                    <Reveal
                        delay={130}
                        as="p"
                        className="max-w-2xl text-lg text-pretty text-muted-foreground"
                    >
                        {description}
                    </Reveal>

                    {meta && (
                        <Reveal delay={190} as="p" className="text-sm text-muted-foreground">
                            {meta}
                        </Reveal>
                    )}

                    {actions && (
                        <Reveal
                            delay={250}
                            className={cn(
                                "mt-4 flex flex-col gap-3 sm:flex-row",
                                centered && "justify-center"
                            )}
                        >
                            {actions}
                        </Reveal>
                    )}
                </div>
            </div>
        </section>
    )
}
