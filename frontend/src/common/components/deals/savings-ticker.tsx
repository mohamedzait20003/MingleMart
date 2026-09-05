import { TrendingDownIcon } from "lucide-react"

import { Marquee } from "@/common/components/animation/marquee"

/**
 * Ticker copy.
 *
 * Fixed rather than live: there is no activity feed on the backend, and this is
 * the one thing on the page that is presentation rather than catalogue. It
 * lives here, next to the only component that reads it, instead of alongside
 * the catalogue data it is not.
 */
const RECENT_SAVINGS = [
    { name: "Amina Y.", saved: 50, item: "Aurora Studio Headphones" },
    { name: "Tomas R.", saved: 41, item: "Drift Trail Runners" },
    { name: "Priya N.", saved: 37, item: "Canvas Weekender Bag" },
    { name: "Daniel O.", saved: 42, item: "Oak Bedside Table" },
    { name: "Lena K.", saved: 21, item: "Weekend Linen Shirt" },
    { name: "Jonas M.", saved: 26, item: "Linen Throw Blanket" },
    { name: "Sofia B.", saved: 18, item: "Nomad Clip Watch" },
    { name: "Marcus D.", saved: 37, item: "Graphite Mechanical Keyboard" },
] as const

/**
 * What other people just saved.
 *
 * Social proof placed immediately under the hero, where the question is still
 * "is this actually a good price". A ticker rather than a grid because the
 * point is the sense of a queue moving, not any one line in it.
 */
export function SavingsTicker() {
    return (
        <section
            aria-label="Recent savings from other shoppers"
            className="border-b border-border bg-muted/40 py-4"
        >
            <Marquee duration={44}>
                <ul className="flex items-center">
                    {RECENT_SAVINGS.map(({ name, saved, item }) => (
                        <li
                            key={item}
                            className="flex items-center gap-2.5 px-5 whitespace-nowrap sm:px-7"
                        >
                            <TrendingDownIcon
                                aria-hidden="true"
                                className="size-4 shrink-0 text-success"
                            />
                            <span className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">{name}</span> saved{" "}
                                <span className="font-bold text-success tabular-nums">
                                    ${saved}
                                </span>{" "}
                                on {item}
                            </span>
                            <span
                                aria-hidden="true"
                                className="ml-5 size-1.5 rounded-full bg-border sm:ml-7"
                            />
                        </li>
                    ))}
                </ul>
            </Marquee>
        </section>
    )
}
