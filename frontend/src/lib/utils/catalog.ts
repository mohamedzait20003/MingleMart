import type { ShopSortParam } from "@/lib/models/catalogModels"

/**
 * What the shop UI needs that is not catalogue data.
 *
 * Products, categories and their counts all come from `GET /api/shop` now.
 * What is left here is the shape of the filter state and the choices the
 * controls offer - decisions about this interface, which the server has no
 * opinion about.
 */

export const SORTS = [
    { value: "relevance", label: "Most relevant" },
    { value: "price-asc", label: "Price: low to high" },
    { value: "price-desc", label: "Price: high to low" },
    { value: "rating", label: "Top rated" },
    { value: "newest", label: "Newest arrivals" },
] as const satisfies readonly { value: ShopSortParam; label: string }[]

export type SortValue = ShopSortParam

/**
 * The price slider's range, not the catalogue's.
 *
 * A shopper who drags to the ceiling means "no upper limit", which is why
 * `max === PRICE_CEILING` is left off the query string entirely rather than
 * sent as a filter that would exclude anything dearer.
 */
export const PRICE_FLOOR = 0
export const PRICE_CEILING = 300

/** Matches the server's own default page size, so page one is not re-cut. */
export const PAGE_SIZE = 12

export interface ShopFilters {
    q: string
    /**
     * Category slugs. Not narrowed to a union: the departments live in the
     * database, so the only honest validation is the server echoing back in
     * `applied.categories` what it actually filtered on.
     */
    categories: string[]
    min: number
    max: number
    rating: number
    sort: SortValue
    page: number
}
