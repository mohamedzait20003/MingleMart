import { Link } from "react-router-dom"
import { ArrowRightIcon, ZapIcon } from "lucide-react"

import { Section } from "@/common/components/main/section"
import { CategoryIcon } from "@/common/components/catalog/category-icon"
import { useLanding } from "@/lib/hooks/useCatalog"
import { Badge } from "@/common/components/ui/badge"
import { formatMoney } from "@/lib/models/catalogModels"
import { Reveal } from "@/common/components/animation/reveal"
import { TONE_CLASS, toneFor } from "@/lib/utils/category-visual"
import { Countdown } from "@/common/components/animation/countdown"


export function DealOfTheDay() {
    const { dealOfTheDay: deal } = useLanding()

    if (!deal) {
        return null
    }

    const { product, savings, endsAt, percentClaimed, unitsLeft } = deal

    return (
        <Section>
            <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-brand-2/12 via-card to-brand-3/12 p-6 sm:p-10 lg:p-14">
                <div
                    aria-hidden="true"
                    data-float=""
                    style={{ "--float-duration": "10s", "--float-distance": "-18px" }}
                    className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full bg-brand-3/20 blur-3xl"
                />

                <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
                    <div>
                        <Badge className="gap-1.5 bg-sale text-sale-foreground">
                            <ZapIcon aria-hidden="true" />
                            {deal.badgeText ?? "Deal of the day"}
                        </Badge>

                        <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            {deal.title}
                        </h2>
                        {deal.headline && (
                            <p className="mt-3 max-w-lg text-pretty text-muted-foreground">
                                {deal.headline}
                            </p>
                        )}

                        <div className="mt-6 flex flex-wrap items-baseline gap-3">
                            <span className="font-heading text-4xl font-extrabold text-sale tabular-nums">
                                {formatMoney(product.price)}
                            </span>
                            <s className="text-xl text-muted-foreground tabular-nums">
                                {formatMoney(product.listPrice)}
                            </s>
                            <span className="rounded-full bg-sale/12 px-2.5 py-1 text-sm font-bold text-sale">
                                Save {formatMoney(savings)}
                            </span>
                        </div>

                        <div className="mt-6 max-w-sm">
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="font-medium">{percentClaimed}% claimed</span>
                                {/* Null means the offer is unlimited: there is no
                                    "4 left" to show, and inventing one would be a lie
                                    about scarcity on the page built to exploit it. */}
                                {unitsLeft !== null && (
                                    <span className="text-muted-foreground tabular-nums">
                                        {unitsLeft} left
                                    </span>
                                )}
                            </div>
                            {/* Native progress semantics, custom paint. */}
                            <div
                                role="progressbar"
                                aria-valuenow={percentClaimed}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="Stock claimed"
                                className="h-2.5 overflow-hidden rounded-full bg-foreground/10"
                            >
                                <div
                                    className="h-full rounded-full bg-linear-to-r from-brand-2 to-brand-3"
                                    style={{ width: `${percentClaimed}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-6 lg:items-center">
                        <div
                            aria-hidden="true"
                            className={`flex aspect-square w-full max-w-64 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${TONE_CLASS[toneFor(product.categorySlug)]}`}
                        >
                            {deal.bannerImageUrl ?? product.imageUrl ? (
                                <img
                                    src={deal.bannerImageUrl ?? product.imageUrl ?? undefined}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="size-full object-cover"
                                />
                            ) : (
                                <CategoryIcon slug={product.categorySlug} className="size-24" />
                            )}
                        </div>

                        <div className="w-full">
                            <p className="mb-2 text-sm font-semibold text-muted-foreground">
                                Ends in
                            </p>
                            <Countdown to={new Date(endsAt)} />
                        </div>

                        <Link
                            to="/deals"
                            className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40"
                        >
                            Grab this deal
                            <ArrowRightIcon aria-hidden="true" className="size-5" />
                        </Link>
                    </div>
                </div>
            </Reveal>
        </Section>
    )
}
