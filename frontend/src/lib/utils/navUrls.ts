import navUrls from '@/common/data/navUrls.json';

export { navUrls };
export default navUrls;

/** A URL template carrying the `:publicUserId` segment. */
export type UserScopedUrl = string;

/**
 * Fills the `:publicUserId` segment of a template from `navUrls.customer` or
 * `navUrls.admin`.
 *
 * The id is missing for exactly as long as the store is rehydrating, and a
 * literal `/user/undefined/cart` would 404 rather than fail loudly, so an
 * absent id collapses to the site root instead.
 */
export function withUser(template: UserScopedUrl, publicUserId?: string | null): string {
    if (!publicUserId) {
        return navUrls.landing.home;
    }

    return template.replace(':publicUserId', publicUserId);
}

/**
 * Turns an absolute URL from this file into the relative `path` a nested
 * `RouteObject` expects.
 *
 * This is what keeps the route table and the navigation reading from one
 * source: a URL renamed here moves the route and every link to it together.
 */
export const routePath = (url: string): string => url.replace(/^\//, '');

/** The pages the common module publishes to every audience, in footer order. */
export const COMMON_URLS = [
    navUrls.common.about,
    navUrls.common.careers,
    navUrls.common.faqs,
    navUrls.common.support,
    navUrls.common.sell,
    navUrls.common.accessibility,
    navUrls.common.privacy,
    navUrls.common.terms,
] as const;
