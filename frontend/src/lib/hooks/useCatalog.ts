import {
    useGetDealsQuery,
    useGetLandingQuery,
    useGetShopQuery,
} from '@/lib/handlers/catalogHandlers';

import type { ApiError } from '@/lib/utils/apiError';
import type {
    CategoryFacet,
    CategoryTile,
    DealCategoryTab,
    DealItem,
    DealOfTheDay,
    DealsSummary,
    PageInfo,
    ProductCardDto,
    ShopQuery,
} from '@/lib/models/catalogModels';

/**
 * The storefront, as the pages want it.
 *
 * Each hook unpacks one endpoint into the pieces a page actually renders, and
 * supplies empty arrays rather than `undefined` while the request is in flight.
 * That is the whole point: a grid that maps over its results should not have to
 * decide what an absent catalogue looks like, and every page that did decide
 * would decide differently.
 *
 * `isLoading` is the first load; `isFetching` covers a refetch with results
 * already on screen, which the shop grid dims rather than blanks.
 */

interface CatalogState {
    isLoading: boolean;
    isFetching: boolean;
    error: ApiError;
}

export interface LandingState extends CatalogState {
    categories: CategoryTile[];
    trending: ProductCardDto[];
    /** Null when no featured campaign is live; the section hides rather than empties. */
    dealOfTheDay: DealOfTheDay | null;
}

/** Category tiles, the trending strip and the headline offer, in one request. */
export function useLanding(): LandingState {
    const { data, isLoading, isFetching, error } = useGetLandingQuery();

    return {
        categories: data?.categories ?? [],
        trending: data?.trending ?? [],
        dealOfTheDay: data?.dealOfTheDay ?? null,
        isLoading,
        isFetching,
        error,
    };
}

export interface ShopState extends CatalogState {
    products: ProductCardDto[];
    page: PageInfo;
    /** Catalogue-wide facet counts, which do not narrow as filters are applied. */
    categories: CategoryFacet[];
}

/** A page of results is one page even before it arrives, so paging can render. */
const EMPTY_PAGE: PageInfo = {
    page: 1,
    size: 0,
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
};

/**
 * One page of the shop grid for the given filters.
 *
 * Filtering, sorting and paging all happen on the server. The client sends what
 * the shopper asked for and renders what comes back, so a result set is never
 * the client's opinion of the catalogue - which is what a browser-side filter
 * over a hardcoded array amounts to.
 */
export function useShop(query: ShopQuery): ShopState {
    const { data, isLoading, isFetching, error } = useGetShopQuery(query);

    return {
        products: data?.products ?? [],
        page: data?.page ?? EMPTY_PAGE,
        categories: data?.categories ?? [],
        isLoading,
        isFetching,
        error,
    };
}

export interface DealsState extends CatalogState {
    summary: DealsSummary;
    flash: DealItem[];
    daily: DealItem[];
    categories: DealCategoryTab[];
}

/** Zeroes, so the hero counts up from nothing instead of flashing a wrong total. */
const EMPTY_SUMMARY: DealsSummary = {
    dealCount: 0,
    deepestPercentOff: 0,
    totalSavings: { amount: 0, currency: 'USD' },
    nextEndsAt: null,
};

/**
 * Today's discounts: the headline strip, the browsable grid, and the totals the
 * hero counts down against.
 *
 * `flash` and `daily` are one list split by the server, never two queries, so a
 * price cannot disagree between the two sections of the same page.
 */
export function useDeals(): DealsState {
    const { data, isLoading, isFetching, error } = useGetDealsQuery();

    return {
        summary: data?.summary ?? EMPTY_SUMMARY,
        flash: data?.flash ?? [],
        daily: data?.daily ?? [],
        categories: data?.categories ?? [],
        isLoading,
        isFetching,
        error,
    };
}
