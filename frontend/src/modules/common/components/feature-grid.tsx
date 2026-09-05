import type { ComponentType, ReactNode, SVGProps } from "react"

import { Card, CardContent } from "@/common/components/ui/card"
import { Stagger } from "@/common/components/animation/reveal"
import { Section, SectionHeading } from "@/common/components/main/section"
import { cn } from "@/lib/utils/utils"

export interface Feature {
    icon: ComponentType<SVGProps<SVGSVGElement>>
    title: string
    body: string
    /** Index into the chart token ramp, so tiles stay on-palette in both themes. */
    tone: 1 | 2 | 3 | 4 | 5
}

const TONE_CLASS: Record<Feature["tone"], string> = {
    1: "bg-chart-1/12 text-chart-1",
    2: "bg-chart-2/12 text-chart-2",
    3: "bg-chart-3/12 text-chart-3",
    4: "bg-chart-4/12 text-chart-4",
    5: "bg-chart-5/12 text-chart-5",
}

type FeatureGridProps = {
    eyebrow?: ReactNode
    title: string
    description?: string
    features: Feature[]
    columns?: 3 | 4
    align?: "start" | "center"
    className?: string
}

/**
 * A titled grid of short, icon-led claims.
 *
 * Used for About's values and for Careers' benefits and culture, so those
 * sections cannot drift into three slightly different card treatments. The
 * cards lift on hover but never move their neighbours — the shadow changes,
 * the box does not.
 */
export function FeatureGrid({
    eyebrow,
    title,
    description,
    features,
    columns = 4,
    align = "center",
    className,
}: Readonly<FeatureGridProps>) {
    return (
        <Section className={className}>
            <SectionHeading
                eyebrow={eyebrow}
                title={title}
                description={description}
                align={align}
            />

            <Stagger
                as="ul"
                step={55}
                className={cn(
                    "grid grid-cols-1 gap-5 sm:grid-cols-2",
                    columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
                )}
            >
                {features.map(({ icon: Icon, title: heading, body, tone }) => (
                    <li key={heading}>
                        <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                            <CardContent className="flex h-full flex-col gap-3">
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        "flex size-12 items-center justify-center rounded-2xl",
                                        TONE_CLASS[tone]
                                    )}
                                >
                                    <Icon className="size-6" />
                                </span>
                                <h3 className="font-heading text-base font-bold">{heading}</h3>
                                <p className="text-pretty text-muted-foreground">{body}</p>
                            </CardContent>
                        </Card>
                    </li>
                ))}
            </Stagger>
        </Section>
    )
}
