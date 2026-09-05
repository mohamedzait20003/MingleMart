import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';

// Middleware
import { RoutePolicy } from '../../lib/auth/policy';
import { guarded } from '../../lib/middlewares/middleware';

// Module Layout
import Layout from './layout';

// Common Components
import Wrapper from '@/common/components/main/wrapper';

// Auth Pages
const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/signup'));
const EmaVerify = lazy(() => import('./pages/emaverify'));
const AccVerify = lazy(() => import('./pages/accverify'));
const PassForgot = lazy(() => import('./pages/passforgot'));
const PassChange = lazy(() => import('./pages/passchange'));
const PassConfirm = lazy(() => import('./pages/passconfirm'));


const authRoutes: RouteObject = {
    path: 'authenticate',
    element: (
        <Wrapper islazy={true}>
            <Layout />
        </Wrapper>
    ),
    children: [
        {
            path: 'sign-up',
            ...guarded(RoutePolicy.guest()),
            element: (
                <Wrapper islazy={true}>
                    <SignUp />
                </Wrapper>
            )
        },
        {
            path: 'account-verify',
            element: (
                <Wrapper islazy={true}>
                    <AccVerify />
                </Wrapper>
            )
        },
        {
            path: 'email-verify',
            element: (
                <Wrapper islazy={true}>
                    <EmaVerify />
                </Wrapper>
            )
        },
        {
            path: 'login',
            ...guarded(RoutePolicy.guest()),
            element: (
                <Wrapper islazy={true}>
                    <Login />
                </Wrapper>
            )
        },
        {
            path: 'password-forgot',
            ...guarded(RoutePolicy.guest()),
            element: (
                <Wrapper islazy={true}>
                    <PassForgot />
                </Wrapper>
            )
        },
        {
            path: 'password-confirm',
            ...guarded(RoutePolicy.guest()),
            element: (
                <Wrapper islazy={true}>
                    <PassConfirm />
                </Wrapper>
            )
        },
        {
            path: 'password-change',
            ...guarded(RoutePolicy.guest()),
            element: (
                <Wrapper islazy={true} >
                    <PassChange />
                </Wrapper>
            )
        }
    ]
};

export default authRoutes;