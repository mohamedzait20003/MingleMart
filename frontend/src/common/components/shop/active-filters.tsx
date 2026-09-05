import { XIcon } from "lucide-react"

import { PRICE_CEILING, PRICE_FLOOR, type ShopFilters } from "@/lib/utils/catalog"

import type { CategoryFacet } from "@/lib/models/catalogModels"

type Chip = { key: string; label: string; clear: Partial<ShopFilters> }

const money = (value: number) =>
    value.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    })

/**
 * Everything currently narrowing the results, each individually removable.
 *
 * Without this the only way to undo a filter is to hunt it down in the panel -
 * which on mobile is behind a drawer the shopper cannot see.
 *
 * Category labels are looked up in the response's own facets, so a slug that
 * arrived from a hand-edited URL still gets a chip that removes it. It shows
 * the raw slug rather than nothing: a filter you cannot see is a filter you
 * cannot clear.
 */
export function ActiveFilters({
    filters,
    categories,
    apply,
    reset,
}: Readonly<{
    filters: ShopFilters
    categories: CategoryFacet[]
    apply: (patch: Partial<ShopFilters>) => void
    reset: () => void
}>) {
    const chips: Chip[] = []

    if (filters.q.trim()) {
        chips.push({ key: "q", label: `“${filters.q.trim()}”`, clear: { q: "" } })
    }

    for (const slug of filters.categories) {
        const label = categories.find((category) => category.slug === slug)?.name ?? slug
        chips.push({
            key: `category-${slug}`,
            label,
            clear: { categories: filters.categories.filter((value) => value !== slug) },
        })
    }

    if (filters.min !== PRICE_FLOOR || filters.max !== PRICE_CEILING) {
        chips.push({
            key: "price",
            label: `${money(filters.min)} – ${money(filters.max)}`,
            clear: { min: PRICE_FLOOR, max: PRICE_CEILING },
        })
    }

    if (filters.rating > 0) {
        chips.push({
            key: "rating",
            label: `${filters.rating} stars and up`,
            clear: { rating: 0 },
        })
    }

    if (chips.length === 0) return null

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtering by</span>

            {chips.map((chip) => (
                <button
                    key={chip.key}
                    type="button"
                    onClick={() => apply(chip.clear)}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card pr-2 pl-3 text-sm font-medium transition-colors outline-none hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                    {chip.label}
                    <XIcon aria-hidden="true" className="size-4" />
                    <span className="sr-only">Remove filter</span>
                </button>
            ))}

            {chips.length > 1 && (
                <button
                    type="button"
                    onClick={reset}
                    className="h-9 cursor-pointer rounded-lg px-2.5 text-sm font-semibold text-primary transition-colors outline-none hover:bg-primary/10 focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                    Clear all
                </button>
            )}
        </div>
    )
}
