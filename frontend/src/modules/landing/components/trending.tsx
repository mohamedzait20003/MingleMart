import { FlameIcon } from "lucide-react"

import { Skeleton } from "@/common/components/ui/skeleton"
import { Stagger } from "@/common/components/animation/reveal"
import { useLanding } from "@/lib/hooks/useCatalog"
import { ProductCard } from "@/common/components/catalog/product-card"
import { Section, SectionHeading } from "@/common/components/main/section"

const GRID = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"

/**
 * What other shoppers are adding to their baskets.
 *
 * The strip comes back with the rest of the landing page in one request, so the
 * prices here and in the deal section below are from the same moment.
 */
export function Trending() {
    const { trending, isLoading } = useLanding()

    if (!isLoading && trending.length === 0) {
        return null
    }

    return (
        <Section className="bg-muted/40">
            <SectionHeading
                eyebrow={
                    <>
                        <FlameIcon aria-hidden="true" className="size-3.5" /> This week
                    </>
                }
                title="Trending right now"
                description="What other shoppers are adding to their baskets today."
                action={{ to: "/shop", label: "Browse the shop" }}
                align="start"
            />

            {isLoading ? (
                <ul className={GRID}>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                        <li key={index}>
                            <Skeleton className="h-80 rounded-xl" />
                        </li>
                    ))}
                </ul>
            ) : (
                <Stagger as="ul" step={50} className={GRID}>
                    {trending.map((product) => (
                        <li key={product.variantId}>
                            <ProductCard product={product} to={`/shop?q=${product.slug}`} />
                        </li>
                    ))}
                </Stagger>
            )}
        </Section>
    )
}
