import { lazy, Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';

// Route Guards
import Redirect from './redirect';
import Protected from './protected';

// Components
import LoadingFallback from '../components/lfallback';

import App from '../App';


// SSR Modules and Pages
import Landing from '../modules/landing/main';
import Company from '../modules/company/main';

// Landing Pages
import LHome from '../modules/landing/pages/home';
import LShop from '../modules/landing/pages/shop';
import LDeals from '../modules/landing/pages/deals';

// Company Pages
import About from '../modules/company/pages/about';
import Terms from '../modules/company/pages/terms';
import Privacy from '../modules/company/pages/privacy';
import Careers from '../modules/company/pages/careers';


// CSR Modules and Pages
const Admin = lazy(() => import('../modules/admin/main'));
const Profile = lazy(() => import('../modules/profile/main'));
const Authenticate = lazy(() => import('../modules/auth/main'));
const Customer = lazy(() => import('../modules/customer/main'));

// Admin Pages
const Users = lazy(() => import('../modules/admin/pages/users'));
const Products = lazy(() => import('../modules/admin/pages/products'));
const Dashboard = lazy(() => import('../modules/admin/pages/dashboard'));

// Auth Pages
const Login = lazy(() => import('../modules/auth/pages/login'));
const SignUp = lazy(() => import('../modules/auth/pages/signup'));
const EmaVerify = lazy(() => import('../modules/auth/pages/emaverify'));
const AccVerify = lazy(() => import('../modules/auth/pages/accverify'));
const PassForgot = lazy(() => import('../modules/auth/pages/passforgot'));
const PassChange = lazy(() => import('../modules/auth/pages/passchange'));
const PassConfirm = lazy(() => import('../modules/auth/pages/passconfirm'));

// Customer Pages
const Cart = lazy(() => import('../modules/customer/pages/cart'));
const CShop = lazy(() => import('../modules/customer/pages/shop'));
const CDeals = lazy(() => import('../modules/customer/pages/deals'));
const Orders = lazy(() => import('../modules/customer/pages/orders'));

export const routes: RouteObject[] = [{
    path: '/',
    element:  <App />,
    children: [
        {
            index: true,
            element:<Redirect />,
        }, 
        {
            path: 'home',
            element: <Landing />,
            children: [
                {
                    index: true,
                    element: <LHome />
                },
                {
                    path: 'shop',
                    element: <LShop />
                },
                {
                    path: 'deals',
                    element: <LDeals />
                }
            ],
        },
        {
            path: 'authenticate',
            element: (
                <Suspense fallback={<LoadingFallback />}>
                    <Authenticate />
                </Suspense>
            ),
            children: [
                {
                    path: 'sign-up',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <SignUp />
                        </Suspense>
                    )
                },
                {
                    path: 'account-verify',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <Protected Roles={["Customer", "Admin"]}>
                                <AccVerify />
                            </Protected>
                        </Suspense>
                    )
                },
                {
                    path: 'email-verify',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <EmaVerify />
                        </Suspense>
                    )
                },
                {
                    path: 'login',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <Login />
                        </Suspense>
                    )
                },
                {
                    path: 'password-forgot',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <PassForgot />
                        </Suspense>
                    )
                },
                {
                    path: 'password-confirm',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <PassConfirm />
                        </Suspense>
                    )
                },
                {
                    path: 'password-change',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <PassChange />
                        </Suspense>
                    )
                }
            ]
        },
        {
            path: 'company',
            element:  <Company />,
            children: [
                {
                    path: 'about',
                    element: <About />
                },
                {
                    path: 'terms',
                    element: <Terms />
                },
                {
                    path: 'privacy',
                    element: <Privacy />
                },
                {
                    path: 'careers',
                    element: <Careers />
                },
            ],
        },
        {
            path: 'profile',
            element: (
                <Suspense fallback={<LoadingFallback />}>
                    <Protected Roles={["Customer", "Admin", "Moderator"]}>
                        <Profile /> 
                    </Protected>
                </Suspense>
            ),
            children: [
            ],
        },
        {
            path: 'customer',
            element: (
                <Suspense fallback={<LoadingFallback />}>
                    <Protected Roles={["Customer"]}>
                        <Customer />
                    </Protected>
                </Suspense>
            ),
            children: [
                {
                    path: 'shop',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <CShop />
                        </Suspense>
                    )
                },
                {
                    path: 'deals',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <CDeals />
                        </Suspense>
                    )
                },
                {
                    path: 'cart',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <Cart />
                        </Suspense>
                    )
                },
                {
                    path: 'orders',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <Orders />
                        </Suspense>
                    )
                }
            ],
        },
        {
            path: 'moderator',
            element: (
                <Suspense fallback={<LoadingFallback />}>
                </Suspense>
            ),
            children: [
            ],
        },
        {
            path: 'admin',
            element: (
                <Suspense fallback={<LoadingFallback />}>
                    <Protected Roles={["Admin"]}>
                        <Admin />
                    </Protected>
                </Suspense>
            ),
            children: [
                {
                    index: true,
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <Dashboard />
                        </Suspense>
                    )
                },
                {
                    path: 'users',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <Users />
                        </Suspense>
                    )
                },
                {
                    path: 'products',
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <Products />
                        </Suspense>
                    )
                }

            ],
        }
    ],
}];
