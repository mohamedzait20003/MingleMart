import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

import {
    PAGE_SIZE,
    PRICE_CEILING,
    PRICE_FLOOR,
    SORTS,
    type ShopFilters,
    type SortValue,
} from "./catalog"

import type { ShopQuery } from "@/lib/models/catalogModels"

const SORT_VALUES = SORTS.map((sort) => sort.value) as readonly string[]

function clampNumber(raw: string | null, fallback: number, min: number, max: number) {
    const parsed = Number(raw)
    if (raw === null || Number.isNaN(parsed)) return fallback
    return Math.min(max, Math.max(min, parsed))
}

/** Reads the whole filter state out of a query string, tolerating hand-edited URLs. */
export function parseShopFilters(params: URLSearchParams): ShopFilters {
    const sort = params.get("sort")
    const min = clampNumber(params.get("min"), PRICE_FLOOR, PRICE_FLOOR, PRICE_CEILING)
    const max = clampNumber(params.get("max"), PRICE_CEILING, PRICE_FLOOR, PRICE_CEILING)

    return {
        q: params.get("q") ?? "",
        // Passed through as written. An unknown slug simply matches nothing on
        // the server, which is a truthful empty result rather than a filter
        // silently dropped here and a result set that contradicts the URL.
        categories: params.getAll("category").filter(Boolean),
        // A hand-edited URL can invert the range; swap rather than show nothing.
        min: Math.min(min, max),
        max: Math.max(min, max),
        rating: clampNumber(params.get("rating"), 0, 0, 5),
        sort: SORT_VALUES.includes(sort ?? "") ? (sort as SortValue) : "relevance",
        page: Math.max(1, clampNumber(params.get("page"), 1, 1, 999)),
    }
}

/** Only non-default values reach the URL, so a clean browse stays a clean link. */
function serialize(filters: ShopFilters, page: number): URLSearchParams {
    const params = new URLSearchParams()
    if (filters.q.trim()) params.set("q", filters.q.trim())
    for (const slug of filters.categories) params.append("category", slug)
    if (filters.min !== PRICE_FLOOR) params.set("min", String(filters.min))
    if (filters.max !== PRICE_CEILING) params.set("max", String(filters.max))
    if (filters.rating > 0) params.set("rating", String(filters.rating))
    if (filters.sort !== "relevance") params.set("sort", filters.sort)
    if (page > 1) params.set("page", String(page))
    return params
}

/**
 * Turns the URL's filter state into the request the catalogue endpoint takes.
 *
 * The bounds are dropped when they are at their extremes: the slider's ceiling
 * means "no maximum", and sending it as one would hide everything above it.
 */
export function toShopQuery(filters: ShopFilters): ShopQuery {
    return {
        q: filters.q.trim() || undefined,
        categories: filters.categories.length ? filters.categories : undefined,
        min: filters.min === PRICE_FLOOR ? undefined : filters.min,
        max: filters.max === PRICE_CEILING ? undefined : filters.max,
        rating: filters.rating > 0 ? filters.rating : undefined,
        sort: filters.sort,
        page: filters.page,
        size: PAGE_SIZE,
    }
}

/**
 * The query string is the single source of truth for the catalogue.
 *
 * That keeps every result set shareable, makes the back button restore the exact
 * view a shopper came from, and lets the hero search and category tiles link
 * straight into a filtered shop without any cross-page state.
 */
export function useShopFilters() {
    const [searchParams, setSearchParams] = useSearchParams()

    const filters = useMemo(() => parseShopFilters(searchParams), [searchParams])

    // Derives the next URL from the previous one rather than from `filters`, which
    // keeps this callback stable across renders - callers can safely depend on it.
    const apply = useCallback(
        (patch: Partial<ShopFilters>, options?: { replace?: boolean }) => {
            setSearchParams(
                (previous) => {
                    const next = { ...parseShopFilters(previous), ...patch }
                    // Any change other than paging returns the shopper to page one;
                    // page 4 of the old result set is meaningless for the new one.
                    return serialize(next, patch.page ?? 1)
                },
                { replace: options?.replace ?? false }
            )
        },
        [setSearchParams]
    )

    const reset = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams])

    const activeCount =
        (filters.q.trim() ? 1 : 0) +
        filters.categories.length +
        (filters.min !== PRICE_FLOOR || filters.max !== PRICE_CEILING ? 1 : 0) +
        (filters.rating > 0 ? 1 : 0)

    return { filters, apply, reset, activeCount }
}
