import { useMemo } from "react"
import { ZapIcon } from "lucide-react"

import { Skeleton } from "@/common/components/ui/skeleton"
import { Countdown } from "@/common/components/animation/countdown"
import { Reveal, Stagger } from "@/common/components/animation/reveal"
import { Section, SectionHeading } from "../main/section"
import { FlashDealCard } from "./flash-deal-card"

import type { DealItem } from "@/lib/models/catalogModels"

const GRID = "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"

/**
 * When the strip rotates.
 *
 * The server's own `nextEndsAt` when it has one - that is the moment an offer
 * actually expires. The top of the next hour is the fallback, so the panel
 * still counts down to something rather than rendering a dash.
 */
function useEndsAt(endsAt: string | null) {
    return useMemo(() => {
        if (endsAt) return new Date(endsAt)

        const next = new Date()
        next.setHours(next.getHours() + 1, 0, 0, 0)
        return next
    }, [endsAt])
}

export function FlashDeals({
    basePath,
    deals,
    endsAt,
    isLoading,
}: Readonly<{
    basePath: string
    deals: DealItem[]
    endsAt: string | null
    isLoading?: boolean
}>) {
    const target = useEndsAt(endsAt)

    if (!isLoading && deals.length === 0) {
        return null
    }

    return (
        <Section id="flash-deals" className="scroll-mt-20">
            <div className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeading
                    className="mb-0 flex-1 sm:mb-0"
                    eyebrow={
                        <>
                            <ZapIcon aria-hidden="true" className="size-3.5" /> This hour only
                        </>
                    }
                    title="Flash deals"
                    description="The steepest cuts on the site right now. Stock is capped, and it does not come back at this price."
                    align="start"
                />

                <Reveal
                    delay={120}
                    className="shrink-0 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm"
                >
                    <p className="mb-2 text-xs font-bold tracking-[0.14em] text-sale uppercase">
                        Rotates in
                    </p>
                    <Countdown to={target} />
                </Reveal>
            </div>

            {isLoading ? (
                <ul className={GRID}>
                    {[0, 1, 2, 3].map((index) => (
                        <li key={index}>
                            <Skeleton className="h-96 rounded-xl" />
                        </li>
                    ))}
                </ul>
            ) : (
                <Stagger as="ul" step={70} className={GRID}>
                    {deals.map((deal) => (
                        <li key={deal.dealId}>
                            <FlashDealCard
                                deal={deal}
                                to={`${basePath}/shop?q=${deal.product.slug}`}
                            />
                        </li>
                    ))}
                </Stagger>
            )}
        </Section>
    )
}
