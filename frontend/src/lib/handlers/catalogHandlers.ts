import baseHandler from './baseHandler';

import type { ApiEnvelope } from '../models/genModels';
import type {
    DealsResponse,
    LandingResponse,
    ShopQuery,
    ShopResponse,
} from '../models/catalogModels';

const unwrap = <T>(response: ApiEnvelope<T>): T => response.data;

function shopQueryString(query: ShopQuery): string {
    const params = new URLSearchParams();

    if (query.q?.trim()) {
        params.set('q', query.q.trim());
    }

    for (const slug of query.categories ?? []) {
        params.append('category', slug);
    }

    if (query.min !== undefined)
        params.set('min', String(query.min));

    if (query.max !== undefined)
        params.set('max', String(query.max));

    if (query.rating)
        params.set('rating', String(query.rating));

    if (query.sort && query.sort !== 'relevance')
        params.set('sort', query.sort);

    if (query.page && query.page > 1)
        params.set('page', String(query.page));

    if (query.size !== undefined)
        params.set('size', String(query.size));

    const search = params.toString();
    return search ? `/shop?${search}` : '/shop';
}

export const catalogHandlers = baseHandler.injectEndpoints({
    endpoints: (builder) => ({
        getLanding: builder.query<LandingResponse, void>({
            query: () => '/landing',
            transformResponse: unwrap<LandingResponse>,
            providesTags: ['Catalog'],
        }),
        getShop: builder.query<ShopResponse, ShopQuery>({
            query: shopQueryString,
            transformResponse: unwrap<ShopResponse>,
            providesTags: ['Catalog'],
        }),
        getDeals: builder.query<DealsResponse, void>({
            query: () => '/deals',
            transformResponse: unwrap<DealsResponse>,
            providesTags: ['Catalog'],
        }),
    }),
});

export const {
    useGetLandingQuery,
    useGetShopQuery,
    useGetDealsQuery,
} = catalogHandlers;

export default catalogHandlers;
