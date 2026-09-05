import { LayersIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs"
import { Stagger } from "@/common/components/animation/reveal"
import { ProductCard } from "../catalog/product-card"
import { Section, SectionHeading } from "../main/section"

import type { DealCategoryTab, DealItem } from "@/lib/models/catalogModels"

/**
 * Pill filter.
 *
 * The stock tab is a 32px segmented control; these are standalone chips that
 * have to clear a 44px touch target, so height, flex and the active colours are
 * all overridden. The outline is an inset shadow rather than a border because
 * the primitive marks its own `border-transparent` important, and two important
 * border colours would settle on stylesheet order rather than intent.
 */
const ALL = "__all__"

const TAB_CLASS =
    "h-11! flex-none! gap-2 rounded-full px-4 text-sm font-semibold " +
    "shadow-[inset_0_0_0_1px_var(--border)] transition-colors hover:bg-muted " +
    "data-active:bg-primary! data-active:text-primary-foreground! data-active:shadow-none " +
    "dark:data-active:bg-primary! dark:data-active:text-primary-foreground!"

function DealGrid({ deals, basePath }: Readonly<{ deals: DealItem[]; basePath: string }>) {
    return (
        <Stagger
            as="ul"
            step={45}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            {deals.map((deal) => (
                <li key={deal.dealId} className="relative">
                    <ProductCard
                        product={deal.product}
                        to={`${basePath}/shop?q=${deal.product.slug}`}
                    />
                </li>
            ))}
        </Stagger>
    )
}

/**
 * The rest of today's discounts, filtered by department.
 *
 * One `<Tabs.Panel>` per category rather than one panel that swaps its contents:
 * that is the pattern screen readers expect, and it means each grid mounts
 * fresh, so the stagger replays as a visible answer to the tap.
 *
 * The cards are the same `ProductCard` the shop grid uses. A deal is not a
 * different kind of object from a product, and it should not look like one.
 */
export function DealsBrowser({
    basePath,
    deals,
    categories,
}: Readonly<{
    basePath: string
    deals: DealItem[]
    /** Only departments that actually have a deal today; the server decides which. */
    categories: DealCategoryTab[]
}>) {
    if (deals.length === 0) {
        return null
    }

    // A pseudo-tab for the unfiltered list. It is not a department, so the
    // server does not send one - but its count is still the real total.
    const tabs = [{ slug: ALL, name: "All deals", count: deals.length }, ...categories]

    const dealsIn = (slug: string) =>
        slug === ALL ? deals : deals.filter((deal) => deal.product.categorySlug === slug)

    return (
        <Section id="all-deals" className="scroll-mt-20 bg-muted/40">
            <SectionHeading
                eyebrow={
                    <>
                        <LayersIcon aria-hidden="true" className="size-3.5" /> Everything else
                    </>
                }
                title="Today’s best deals"
                description="Refreshed each morning and held until midnight. Pick a department, or take the lot."
                action={{ to: `${basePath}/shop`, label: "Browse the full shop" }}
                align="start"
            />

            <Tabs defaultValue={ALL}>
                {/* Default variant, not `line`: the line variant paints an underline
                    under the active tab, which fights a filled pill. */}
                <TabsList className="h-auto! w-full flex-wrap justify-start gap-2 bg-transparent! p-0!">
                    {tabs.map(({ slug, name, count }) => (
                        <TabsTrigger key={slug} value={slug} className={TAB_CLASS}>
                            {name}
                            <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-xs font-bold tabular-nums in-data-active:bg-primary-foreground/20">
                                {count}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map(({ slug }) => (
                    <TabsContent key={slug} value={slug} className="mt-8">
                        <DealGrid deals={dealsIn(slug)} basePath={basePath} />
                    </TabsContent>
                ))}
            </Tabs>
        </Section>
    )
}
