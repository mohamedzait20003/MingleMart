/**
 * The storefront contract, mirroring the catalog module's DTOs.
 *
 * Field for field with `com.minglemart.modules.catalog.dtos`. Where a name
 * differs from what the UI would have called it, the backend name wins: a
 * response that has to be renamed on arrival is a response nobody can grep for.
 */

/** `shared/common/Money`. Serialised as a JSON number; never do arithmetic on it in float. */
export interface Money {
    amount: number;
    currency: string;
}

/**
 * One product tile, shared by every storefront grid.
 *
 * `variantId` is what a cart takes: the product is what a shopper browses, the
 * default variant is what they buy. `listPrice` equals `price` when nothing is
 * on offer, so a card can render the struck-through "was" by comparing the two
 * rather than null-checking. `rating` is null when nobody has reviewed it --
 * unrated, which should not look like a bad score.
 */
export interface ProductCardDto {
    variantId: string;
    productId: string;
    slug: string;
    name: string;
    brand: string | null;
    sku: string;
    categorySlug: string;
    price: Money;
    listPrice: Money;
    percentOff: number;
    onOffer: boolean;
    imageUrl: string | null;
    rating: number | null;
    reviewCount: number;
}

/** `deals.kind`. Presentational only -- nothing about pricing depends on it. */
export type DealKind = 'FLASH' | 'DAILY' | 'CLEARANCE' | 'BUNDLE' | 'CAMPAIGN';

// --------------------------------------------------------------- landing ---

export interface CategoryTile {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    productCount: number;
}

/**
 * The hero offer. Null when no featured campaign is live, and the section
 * should then disappear rather than render an empty countdown.
 */
export interface DealOfTheDay {
    dealId: string;
    slug: string;
    title: string;
    headline: string | null;
    badgeText: string | null;
    bannerImageUrl: string | null;
    endsAt: string;
    product: ProductCardDto;
    savings: Money;
    unitsLeft: number | null;
    percentClaimed: number;
}

export interface LandingResponse {
    categories: CategoryTile[];
    trending: ProductCardDto[];
    dealOfTheDay: DealOfTheDay | null;
}

// ------------------------------------------------------------------ shop ---

/**
 * The `?sort=` value. Lowercase and hyphenated, which is what `ShopSort.from`
 * parses on the way in.
 */
export type ShopSortParam =
    | 'relevance'
    | 'price-asc'
    | 'price-desc'
    | 'rating'
    | 'newest';

/**
 * The same choice on the way back out.
 *
 * Jackson writes an enum as its constant name, so the response echoes
 * `PRICE_ASC` where the request sent `price-asc`. Two spellings of one idea,
 * which is exactly the kind of thing that is silently wrong until someone
 * compares them - hence `SORT_PARAM_OF` below.
 */
export type ShopSortName =
    | 'RELEVANCE'
    | 'PRICE_ASC'
    | 'PRICE_DESC'
    | 'RATING'
    | 'NEWEST';

export const SORT_PARAM_OF: Record<ShopSortName, ShopSortParam> = {
    RELEVANCE: 'relevance',
    PRICE_ASC: 'price-asc',
    PRICE_DESC: 'price-desc',
    RATING: 'rating',
    NEWEST: 'newest',
};

/** `page` is 1-based, matching the `?page=` the storefront uses. */
export interface PageInfo {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
}

/** Catalogue-wide counts: they do not narrow as other filters are applied. */
export interface CategoryFacet {
    id: string;
    slug: string;
    name: string;
    count: number;
}

/**
 * What the server actually filtered on, after its own clamping.
 *
 * Rendered by the active-filter chips in preference to the local filter state,
 * so the chips cannot claim a filter the results were not narrowed by.
 */
export interface AppliedFilters {
    q: string | null;
    categories: string[] | null;
    minPrice: number | null;
    maxPrice: number | null;
    minRating: number | null;
    sort: ShopSortName;
}

export interface ShopResponse {
    products: ProductCardDto[];
    page: PageInfo;
    categories: CategoryFacet[];
    applied: AppliedFilters;
}

/** Everything `GET /api/shop` accepts. Omitted keys are left off the query string. */
export interface ShopQuery {
    q?: string;
    categories?: string[];
    min?: number;
    max?: number;
    rating?: number;
    sort?: ShopSortParam;
    page?: number;
    size?: number;
}

// ----------------------------------------------------------------- deals ---

/** Hero figures. `nextEndsAt` drives the countdown. */
export interface DealsSummary {
    dealCount: number;
    deepestPercentOff: number;
    totalSavings: Money;
    nextEndsAt: string | null;
}

export interface DealItem {
    product: ProductCardDto;
    dealId: string;
    dealSlug: string;
    dealTitle: string;
    dealKind: DealKind;
    badgeText: string | null;
    endsAt: string | null;
    savings: Money;
    /** Null when the offer is unlimited: there is no "4 left" to show. */
    unitsLeft: number | null;
    percentClaimed: number;
}

/** Only categories that actually have a deal today get a tab. */
export interface DealCategoryTab {
    categoryId: string;
    slug: string;
    name: string;
    count: number;
}

export interface DealsResponse {
    summary: DealsSummary;
    /** The headline strip and the browsable remainder: one list, split. */
    flash: DealItem[];
    daily: DealItem[];
    categories: DealCategoryTab[];
}

// ---------------------------------------------------------------- format ---

/**
 * Formats an amount in its own currency.
 *
 * The currency travels with every amount, so nothing here assumes USD - a
 * hardcoded symbol is how a EUR price ends up labelled as dollars.
 */
export const formatMoney = (money: Money): string =>
    money.amount.toLocaleString(undefined, {
        style: 'currency',
        currency: money.currency,
    });

/** True when the product is cheaper than its list price and can show a "was". */
export const hasDiscount = (product: ProductCardDto): boolean =>
    product.onOffer && product.listPrice.amount > product.price.amount;
