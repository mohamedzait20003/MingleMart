import { type RouteObject } from 'react-router-dom';

// Middleware
import { RoutePolicy } from '../../lib/auth/policy';
import { guarded } from '../../lib/middlewares/middleware';

// Module Layout
import Layout from './layout';

// Common Components
import Wrapper from '@/common/components/main/wrapper';

// Server-side data
import catalogHandlers from '@/lib/handlers/catalogHandlers';
import { parseShopFilters, toShopQuery } from '@/lib/utils/use-shop-filters';

// Module Pages
import LHome from './pages/home';
import LShop from './pages/shop';
import LDeals from './pages/deals';

const LandingRoutes: RouteObject = {
    ...guarded(RoutePolicy.guest()),
    element: <Layout />,
    children: [
        {
            index: true,
            // The home page is one request: tiles, trending strip and headline
            // offer all come from `/landing`.
            handle: { prefetch: () => [catalogHandlers.endpoints.getLanding.initiate()] },
            element: (
                <Wrapper islazy={false}>
                    <LHome />
                </Wrapper>
            )
        },
        {
            path: 'shop',
            // Reads its own filters out of the URL, so a shared link renders
            // the filtered grid server-side rather than an empty one.
            handle: {
                prefetch: (request: Request) => [
                    catalogHandlers.endpoints.getShop.initiate(
                        toShopQuery(parseShopFilters(new URL(request.url).searchParams)),
                    ),
                ],
            },
            element: (
                <Wrapper islazy={false}>
                    <LShop />
                </Wrapper>
            )
        },
        {
            path: 'deals',
            handle: { prefetch: () => [catalogHandlers.endpoints.getDeals.initiate()] },
            element: (
                <Wrapper islazy={false}>
                    <LDeals />
                </Wrapper>
            )
        },
    ],
};

export default LandingRoutes;
