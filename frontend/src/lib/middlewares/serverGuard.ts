import { matchRoutes } from 'react-router-dom';

import type { RoutePolicyType } from '../auth/policy';
import { getSession } from '../auth/session';
import { evaluatePolicy } from './middleware';
import { routes } from '../../routes';

/**
 * Applies the route policies to a request during SSR.
 *
 * React Router's `createStaticHandler().query()` does not run route
 * `middleware` — verified against 7.18 — so the client-side guards are inert on
 * a direct URL hit. Without this, the server renders the protected page, sends
 * it, and only the client bounces after hydration.
 *
 * Policies are read from each matched route's `handle`, populated by `guarded()`.
 * Every matched policy is applied parent-first, and the first redirect wins,
 * which mirrors how React Router runs middleware down the match chain.
 *
 * @returns the path to redirect to, or null to render normally
 */
export function resolveGuardRedirect(request: Request): string | null {
    const url = new URL(request.url);
    const session = getSession(request);
    const matches = matchRoutes(routes, url.pathname) ?? [];

    for (const match of matches) {
        const handle = match.route.handle as { policy?: RoutePolicyType } | undefined;
        const policy = handle?.policy;

        if (!policy) {
            continue;
        }

        const target = evaluatePolicy(policy, session, url, match.params);

        if (target && target !== `${url.pathname}${url.search}`) {
            return target;
        }
    }

    return null;
}
