import { CountUp } from "@/common/components/animation/count-up"
import { Stagger } from "@/common/components/animation/reveal"
import { Section } from "@/common/components/main/section"

export interface Stat {
    value: number
    prefix?: string
    suffix?: string
    decimals?: number
    label: string
}

/**
 * A row of headline figures.
 *
 * `CountUp` ships the finished number in the markup and only animates once it
 * scrolls into view, so the figures are correct for a crawler, for a reader
 * with JavaScript off, and for anyone who has asked for reduced motion.
 *
 * The list is a `<dl>`: each figure is the value for the label beside it, and
 * pairing them that way is what makes the row mean something when it is read
 * aloud rather than seen.
 */
export function StatsBand({ stats }: Readonly<{ stats: Stat[] }>) {
    return (
        <Section className="border-y border-border bg-muted/40 py-14 sm:py-16 lg:py-20">
            <Stagger
                as="dl"
                step={70}
                className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4"
            >
                {stats.map(({ value, prefix, suffix, decimals, label }) => (
                    // Term before definition in the DOM, as the spec requires;
                    // `flex-col-reverse` puts the figure on top where it belongs.
                    <div key={label} className="flex flex-col-reverse gap-1">
                        <dt className="text-sm text-muted-foreground">{label}</dt>
                        <dd className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">
                            <CountUp
                                to={value}
                                prefix={prefix}
                                suffix={suffix}
                                decimals={decimals}
                            />
                        </dd>
                    </div>
                ))}
            </Stagger>
        </Section>
    )
}
