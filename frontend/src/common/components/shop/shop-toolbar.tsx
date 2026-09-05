import { useEffect, useState } from "react"
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react"

import { Input } from "@/common/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/common/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/common/components/ui/sheet"
import { SORTS, type ShopFilters, type SortValue } from "@/lib/utils/catalog"

import type { CategoryFacet } from "@/lib/models/catalogModels"
import { ShopFiltersPanel } from "./shop-filters"

export function ShopToolbar({
    filters,
    categories,
    apply,
    total,
    activeCount,
}: Readonly<{
    filters: ShopFilters
    /** Facets for the drawer's category list, passed through from the response. */
    categories: CategoryFacet[]
    apply: (patch: Partial<ShopFilters>, options?: { replace?: boolean }) => void
    /** Total matches across every page, which is what the count announces. */
    total: number
    activeCount: number
}>) {
    const [draft, setDraft] = useState(filters.q)
    const [syncedQuery, setSyncedQuery] = useState(filters.q)

    // Adopt a query that arrived from somewhere else — a category tile, the hero
    // search, the back button. Adjusting state during render is React's own
    // pattern for this; doing it in an effect would render the stale value first.
    if (syncedQuery !== filters.q) {
        setSyncedQuery(filters.q)
        setDraft(filters.q)
    }

    // Debounced, and replacing rather than pushing: one history entry per search,
    // not one per keystroke, so Back leaves the shop instead of retyping it.
    useEffect(() => {
        if (draft === filters.q) return
        const timer = setTimeout(() => apply({ q: draft }, { replace: true }), 300)
        return () => clearTimeout(timer)
    }, [draft, filters.q, apply])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <label htmlFor="shop-search" className="sr-only">
                        Search products
                    </label>
                    <SearchIcon
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        id="shop-search"
                        type="search"
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder="Search the shop"
                        className="h-12 rounded-xl pl-11 text-base"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Filters live in a drawer below lg, where a sidebar would eat the grid. */}
                    <Sheet>
                        <SheetTrigger className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 lg:hidden">
                            <SlidersHorizontalIcon aria-hidden="true" className="size-4" />
                            Filters
                            {activeCount > 0 && (
                                <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground tabular-nums">
                                    {activeCount}
                                </span>
                            )}
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[min(22rem,90vw)] overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="px-4 pb-8">
                                <ShopFiltersPanel
                                    filters={filters}
                                    categories={categories}
                                    apply={apply}
                                    bare
                                />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex-1 sm:flex-none">
                        <label htmlFor="shop-sort" className="sr-only">
                            Sort results
                        </label>
                        <Select
                            value={filters.sort}
                            onValueChange={(value) => apply({ sort: value as SortValue })}
                        >
                            <SelectTrigger id="shop-sort" className="h-12 w-full rounded-xl sm:w-56">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SORTS.map((sort) => (
                                    <SelectItem key={sort.value} value={sort.value}>
                                        {sort.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Announced politely so screen reader users hear the count change as
                filters are adjusted, without the focus being stolen. */}
            <p aria-live="polite" className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground tabular-nums">{total}</span>{" "}
                {total === 1 ? "product" : "products"}
                {filters.q.trim() && <> matching “{filters.q.trim()}”</>}
            </p>
        </div>
    )
}
