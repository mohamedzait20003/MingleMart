import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';

// Middleware
import { RoutePolicy } from '../../lib/auth/policy';
import { guarded } from '../../lib/middlewares/middleware';

// Module Layout
import Layout from './Layout';

// Common Components
import Wrapper from '@/common/components/main/wrapper';

// Module Pages
const Cart = lazy(() => import('./pages/cart'));
const CShop = lazy(() => import('./pages/shop'));
const CDeals = lazy(() => import('./pages/deals'));
const Orders = lazy(() => import('./pages/orders'));

/**
 * Everything a signed-in customer sees, under their own id.
 *
 * `owner` makes the guard check the id in the URL against the session, so
 * `/user/someone-else/orders` never renders.
 */
const CustomerRoutes: RouteObject = {
    path: 'user/:publicUserId',
    ...guarded(RoutePolicy.protected(['Customer'], { owner: true })),
    element: (
        <Wrapper islazy={true}>
            <Layout />
        </Wrapper>
    ),
    children: [
        {
            index: true,
            element: (
                <Wrapper islazy={true}>
                    <CShop />
                </Wrapper>
            )
        },
        {
            path: 'shop',
            element: (
                <Wrapper islazy={true}>
                    <CShop />
                </Wrapper>
            )
        },
        {
            path: 'deals',
            element: (
                <Wrapper islazy={true}>
                    <CDeals />
                </Wrapper>
            )
        },
        {
            path: 'cart',
            element: (
                <Wrapper islazy={true}>
                    <Cart />
                </Wrapper>
            )
        },
        {
            path: 'orders',
            element: (
                <Wrapper islazy={true}>
                    <Orders />
                </Wrapper>
            )
        },
    ],
};

export default CustomerRoutes;
