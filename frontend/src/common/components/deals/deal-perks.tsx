import { BadgeCheckIcon, RotateCcwIcon, ScaleIcon, TruckIcon } from "lucide-react"

import { Card, CardContent } from "@/common/components/ui/card"
import { Stagger } from "@/common/components/animation/reveal"
import { Section, SectionHeading } from "../main/section"

const PERKS = [
    {
        icon: ScaleIcon,
        title: "The discount is real",
        body: "Every struck price is what the item sold for in the last thirty days. No inflated “was” figures, ever.",
        tone: "text-chart-2",
    },
    {
        icon: RotateCcwIcon,
        title: "Sale items return free",
        body: "A discount does not cost you the return window. Thirty days, postage paid, same as full price.",
        tone: "text-chart-5",
    },
    {
        icon: TruckIcon,
        title: "Shipping still free over $50",
        body: "The deal price counts toward the threshold, so a discount never pushes you back into paying postage.",
        tone: "text-chart-4",
    },
    {
        icon: BadgeCheckIcon,
        title: "Price-match for 14 days",
        body: "If it drops further while the sale runs, tell us and we refund the difference to your card.",
        tone: "text-chart-1",
    },
]

/**
 * The objections that stop people buying at a discount.
 *
 * Placed after the grid, where someone has found something they want and is
 * now looking for the catch. Each card answers one specific doubt rather than
 * restating a generic promise.
 */
export function DealPerks() {
    return (
        <Section>
            <SectionHeading
                eyebrow="No catch"
                title="What a sale price does not cost you"
                description="Four things that stay exactly the same whether you pay full price or half of it."
            />

            <Stagger
                as="ul"
                step={55}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
                {PERKS.map(({ icon: Icon, title, body, tone }) => (
                    <li key={title}>
                        <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                            <CardContent className="flex h-full flex-col gap-3">
                                <span
                                    aria-hidden="true"
                                    className={`flex size-12 items-center justify-center rounded-2xl bg-current/10 ${tone}`}
                                >
                                    <Icon className="size-6" />
                                </span>
                                <h3 className="font-heading text-base font-bold">{title}</h3>
                                <p className="text-pretty text-muted-foreground">{body}</p>
                            </CardContent>
                        </Card>
                    </li>
                ))}
            </Stagger>
        </Section>
    )
}
