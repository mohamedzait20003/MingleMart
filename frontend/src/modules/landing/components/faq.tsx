import { Link } from "react-router-dom"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/common/components/ui/accordion"
import { Reveal } from "@/common/components/animation/reveal"
import { Section, SectionHeading } from "@/common/components/main/section"

const QUESTIONS = [
    {
        q: "How much is shipping?",
        a: "Free on every order over $50. Below that it is a flat $4.95, and you will see the exact figure before you pay — never at the last step.",
    },
    {
        q: "What if something does not fit?",
        a: "Send it back within 30 days for a full refund. Return postage is on us, and the refund is issued as soon as the parcel is scanned by the carrier.",
    },
    {
        q: "Who am I actually buying from?",
        a: "Independent sellers, each one verified before they can list. The seller's name and rating sit on every product page, and your payment is held until the item arrives.",
    },
    {
        q: "Is my payment information safe?",
        a: "Card details are encrypted in transit and never touch our servers — payments are handled by our PCI-compliant processor. We only ever store the last four digits.",
    },
    {
        q: "Can I track my order?",
        a: "Yes. Tracking goes live the moment the seller hands the parcel over, and you can follow it from your orders page or from the link in your confirmation email.",
    },
]

export function Faq() {
    return (
        <Section>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div>
                    <SectionHeading
                        eyebrow="Good to know"
                        title="Questions, answered"
                        description="The five things people ask us most before their first order."
                        align="start"
                    />
                    <Reveal as="p" className="-mt-6 text-sm text-muted-foreground">
                        Still stuck?{" "}
                        <Link
                            to="/about"
                            className="rounded-sm font-semibold text-primary underline underline-offset-4 outline-none hover:no-underline focus-visible:ring-3 focus-visible:ring-ring/40"
                        >
                            Talk to a human
                        </Link>
                        , any hour of the day.
                    </Reveal>
                </div>

                <Reveal delay={80}>
                    <Accordion className="w-full">
                        {QUESTIONS.map(({ q, a }) => (
                            <AccordionItem key={q} value={q}>
                                <AccordionTrigger className="py-5 text-left text-base font-semibold">
                                    {q}
                                </AccordionTrigger>
                                <AccordionContent className="pb-5 text-base text-pretty text-muted-foreground">
                                    {a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Reveal>
            </div>
        </Section>
    )
}
