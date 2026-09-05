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
const NotFound = lazy(() => import('./pages/not-found'));
const Unauthorized = lazy(() => import('./pages/unauthorized'));

const ErrorRoutes: RouteObject = {
    ...guarded(RoutePolicy.public()),
    element: (
        <Wrapper islazy={true}>
            <Layout />
        </Wrapper>
    ),
    children: [
        {
            path: routePath(navUrls.unauthorized),
            handle: { status: 403 },
            element: (
                <Wrapper islazy={true}>
                    <Unauthorized />
                </Wrapper>
            ),
        },
        {
            path: '*',
            handle: { status: 404 },
            element: (
                <Wrapper islazy={true}>
                    <NotFound />
                </Wrapper>
            ),
        },
    ],
};

export default ErrorRoutes;
