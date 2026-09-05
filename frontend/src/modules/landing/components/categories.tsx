import { Link } from "react-router-dom"
import { ArrowUpRightIcon } from "lucide-react"

import { Skeleton } from "@/common/components/ui/skeleton"
import { Stagger } from "@/common/components/animation/reveal"
import { useLanding } from "@/lib/hooks/useCatalog"
import { CategoryIcon } from "@/common/components/catalog/category-icon"
import { TONE_TILE_CLASS, toneFor } from "@/lib/utils/category-visual"
import { Section, SectionHeading } from "@/common/components/main/section"

/** Placeholders while the catalogue loads, so the section keeps its height. */
function CategorySkeletons() {
    return (
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <li key={index}>
                    <Skeleton className="h-44 rounded-2xl sm:h-48" />
                </li>
            ))}
        </ul>
    )
}

/**
 * The departments, from the catalogue.
 *
 * Names and product counts are the server's; only the icon and the colour are
 * decided here, keyed by slug. The section hides itself when the catalogue has
 * no categories rather than rendering an empty grid under a heading that
 * promises one.
 */
export function Categories() {
    const { categories, isLoading } = useLanding()

    if (!isLoading && categories.length === 0) {
        return null
    }

    return (
        <Section id="categories">
            <SectionHeading
                eyebrow="Browse"
                title="Shop by category"
                description="Every department, thousands of independent sellers, one basket."
                action={{ to: "/shop", label: "All categories" }}
                align="start"
            />

            {isLoading ? (
                <CategorySkeletons />
            ) : (
                <Stagger
                    as="ul"
                    step={55}
                    className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3"
                >
                    {categories.map(({ id, slug, name, productCount }) => (
                            <li key={id}>
                                <Link
                                    to={`/shop?category=${slug}`}
                                    className={`group/cat flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-linear-to-br p-5 transition-all duration-300 ease-(--ease-out-soft) outline-none hover:-translate-y-1 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/40 motion-reduce:hover:translate-y-0 sm:p-6 ${TONE_TILE_CLASS[toneFor(slug)]}`}
                                >
                                    <CategoryIcon
                                        slug={slug}
                                        className="size-9 transition-transform duration-300 ease-(--ease-out-soft) group-hover/cat:scale-110 motion-reduce:group-hover/cat:scale-100 sm:size-10"
                                    />
                                    <div className="flex items-end justify-between gap-3">
                                        <div>
                                            <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                                                {name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground tabular-nums">
                                                {productCount.toLocaleString()} items
                                            </p>
                                        </div>
                                        <ArrowUpRightIcon
                                            aria-hidden="true"
                                            className="size-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover/cat:translate-x-0.5 group-hover/cat:-translate-y-0.5 group-hover/cat:text-foreground motion-reduce:transition-none"
                                        />
                                    </div>
                                </Link>
                            </li>
                    ))}
                </Stagger>
            )}
        </Section>
    )
}
