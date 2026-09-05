import { Reveal, Stagger } from "@/common/components/animation/reveal"
import { Section, SectionHeading } from "@/common/components/main/section"

export interface Milestone {
    year: string
    title: string
    body: string
}

/**
 * The company story as a dated spine rather than three paragraphs.
 *
 * A visitor on an About page is skimming for scale and credibility, and a
 * timeline answers both in one pass. The rail and the nodes are decorative and
 * hidden from assistive tech; what gets read out is an ordered list of years
 * and what happened in them.
 */
export function StoryTimeline({
    eyebrow,
    title,
    description,
    milestones,
}: Readonly<{
    eyebrow?: string
    title: string
    description?: string
    milestones: Milestone[]
}>) {
    return (
        <Section>
            <SectionHeading
                eyebrow={eyebrow}
                title={title}
                description={description}
                align="start"
            />

            <div className="relative">
                {/* The rail sits behind the nodes and stops short of the last one,
                    so the sequence reads as finished rather than cut off. */}
                <span
                    aria-hidden="true"
                    className="absolute top-2 bottom-8 left-[7px] w-px bg-gradient-to-b from-brand-2 via-brand-3 to-transparent sm:left-[11px]"
                />

                <Stagger as="ol" step={80} className="flex flex-col gap-10">
                    {milestones.map(({ year, title: heading, body }) => (
                        <li key={year} className="relative flex gap-6 pl-8 sm:pl-12">
                            <span
                                aria-hidden="true"
                                className="absolute top-1.5 left-0 flex size-4 items-center justify-center rounded-full bg-background ring-2 ring-brand-2 sm:size-6"
                            >
                                <span className="size-1.5 rounded-full bg-brand-2 sm:size-2" />
                            </span>

                            <div className="flex-1">
                                <p className="font-heading text-sm font-bold text-primary tabular-nums">
                                    {year}
                                </p>
                                <h3 className="mt-1 font-heading text-xl font-bold text-balance">
                                    {heading}
                                </h3>
                                <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">
                                    {body}
                                </p>
                            </div>
                        </li>
                    ))}
                </Stagger>
            </div>

            <Reveal
                as="p"
                delay={120}
                className="mt-12 max-w-2xl text-pretty text-muted-foreground"
            >
                Still the same plan: a marketplace where small sellers get found, and where the
                price you see at the top of the page is the price you pay at the bottom of it.
            </Reveal>
        </Section>
    )
}
