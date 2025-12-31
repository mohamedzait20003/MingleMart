import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Redirect from './redirect';
import Protected from './protected';

const App = lazy(() => import('../App'));

const Landing = lazy(() => import('../modules/landing/main'));
const Authenticate = lazy(() => import('../modules/auth/authenticate'));

const LHome = lazy(() => import('../modules/landing/pages/home'));

const Login = lazy(() => import('../modules/auth/pages/login'));
const SignUp = lazy(() => import('../modules/auth/pages/signup'));
const Verify = lazy(() => import('../modules/auth/pages/verify'));


const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense fallback={<div>Loading...</div>}>
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
                            <Suspense fallback={<div>Loading...</div>}>
                                <LHome />
                            </Suspense>
                        )
                    },
                ],
            },
            {
                path: 'authenticate',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <Authenticate />
                    </Suspense>
                ),
                children: [
                    {
                        path: 'sign-up',
                        element: (
                            <Suspense fallback={<div>Loading...</div>}>
                                <SignUp />
                            </Suspense>
                        )
                    },
                    {
                        path: 'verify',
                        element: (
                            <Suspense fallback={<div>Loading...</div>}>
                                <Verify />
                            </Suspense>
                        )
                    },
                    {
                        path: 'login',
                        element: (
                            <Suspense fallback={<div>Loading...</div>}>
                                <Login />
                            </Suspense>
                        )
                    }
                ]
            },
            {
                path: 'shop',
                children: [
                ],
            },
            {
                path: 'admin',
                
            }
        ],
    }
]);

export default router;
