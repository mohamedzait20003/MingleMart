import { lazy, Suspense } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import Redirect from './redirect';
import Protected from './protected';

import LoadingFallback from '../components/lfallback';

const App = lazy(() => import('../App'));

const Landing = lazy(() => import('../modules/landing/main'));
const Authenticate = lazy(() => import('../modules/auth/authenticate'));
const Customer = lazy(() => import('../modules/customer/customer'));

const LHome = lazy(() => import('../modules/landing/pages/home'));

const Login = lazy(() => import('../modules/auth/pages/login'));
const SignUp = lazy(() => import('../modules/auth/pages/signup'));
const EmaVerify = lazy(() => import('../modules/auth/pages/emaverify'));
const AccVerify = lazy(() => import('../modules/auth/pages/accverify'));
const PassForgot = lazy(() => import('../modules/auth/pages/passforgot'));
const PassChange = lazy(() => import('../modules/auth/pages/passchange'));
const PassConfirm = lazy(() => import('../modules/auth/pages/passconfirm'));

const routes: RouteObject[] = [{
    path: '/',
    element: (
        <Suspense fallback={<LoadingFallback />}>
            <App />
        </Suspense>
    ),
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
                    element: (
                        <Suspense fallback={<LoadingFallback />}>
                            <LHome />
                        </Suspense>
                    )
                },
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
            path: 'customer',
            element: (
                <Suspense fallback={<LoadingFallback />}>
                    <Protected Roles={["Customer"]}>
                        <Customer />
                    </Protected>
                </Suspense>
            ),
            children: [
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
                </Suspense>
            ),
            children: [
            ],
        }
    ],
}];

const router = createBrowserRouter(routes);

export default router;
