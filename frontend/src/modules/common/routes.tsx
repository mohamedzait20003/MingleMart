import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';

// Middleware
import { RoutePolicy } from '../../lib/auth/policy';
import { guarded } from '../../lib/middlewares/middleware';

// Module Layout
import Layout from './layout';

// Common Components
import Wrapper from '@/common/components/main/wrapper';

// URL data
import { navUrls, routePath } from '@/lib/utils/navUrls';

// Module Pages
const Faqs = lazy(() => import('./pages/faqs'));
const Sell = lazy(() => import('./pages/sell'));
const About = lazy(() => import('./pages/about'));
const Terms = lazy(() => import('./pages/terms'));
const Privacy = lazy(() => import('./pages/privacy'));
const Careers = lazy(() => import('./pages/careers'));
const Support = lazy(() => import('./pages/support'));
const Accessibility = lazy(() => import('./pages/accessibility'));

// Ordered as the footer lists them, so the route table and the navigation read
// the same way round.
const PAGES = [
    { url: navUrls.common.about, Page: About },
    { url: navUrls.common.careers, Page: Careers },
    { url: navUrls.common.faqs, Page: Faqs },
    { url: navUrls.common.support, Page: Support },
    { url: navUrls.common.sell, Page: Sell },
    { url: navUrls.common.accessibility, Page: Accessibility },
    { url: navUrls.common.privacy, Page: Privacy },
    { url: navUrls.common.terms, Page: Terms },
];

/**
 * The pages every audience shares, mounted once at the root.
 *
 * They used to be spread into landing, customer and admin, which gave each page
 * three URLs and forced the guard to carry a list of "shared" segments so a
 * signed-in reader following `/privacy` was not bounced. Public policy and a
 * single mount replace all of that: one URL, reachable signed in or not.
 */
const CommonRoutes: RouteObject = {
    ...guarded(RoutePolicy.public()),
    element: (
        <Wrapper islazy={true}>
            <Layout />
        </Wrapper>
    ),
    children: PAGES.map(({ url, Page }) => ({
        path: routePath(url),
        element: (
            <Wrapper islazy={true}>
                <Page />
            </Wrapper>
        ),
    })),
};

export default CommonRoutes;
