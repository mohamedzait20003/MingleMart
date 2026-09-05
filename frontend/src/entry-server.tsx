import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, matchRoutes, redirect, StaticRouterProvider } from 'react-router-dom';

import { resolveGuardRedirect } from './lib/middlewares/serverGuard';

import type { RoutePrefetch } from './lib/middlewares/middleware';

import baseHandler from './lib/handlers/baseHandler';
import { getSession } from './lib/auth/session';
import { userStateFromSession } from './store/slices/userSlice';

import { routes } from './routes';
import { makeStore, type RootState } from './store';

const statusFor = (request: Request): number => {
    const matches = matchRoutes(routes, new URL(request.url).pathname) ?? [];

    return matches.reduce(
        (status, match) => (match.route.handle as { status?: number } | undefined)?.status ?? status,
        200,
    );
};

export const render = async (url: string, headers?: Headers) => {
    const request = new Request(`http://localhost${url}`, { headers });
    const guardRedirect = resolveGuardRedirect(request);

    if (guardRedirect) {
        throw redirect(guardRedirect);
    }

    const handler = createStaticHandler(routes);
    const context = await handler.query(request);

    if (context instanceof Response) {
        throw context;
    }

    const router = createStaticRouter(handler.dataRoutes, context);

    const store = makeStore({
        preloadedState: { user: userStateFromSession(getSession(request)) },
        cookie: headers?.get('cookie') ?? undefined,
    });

    // Start what the matched routes declared they need, before rendering.
    //
    // RTK Query starts a request from an effect and `renderToString` runs no
    // effects, so nothing fetches itself on the server: without this the whole
    // page renders in its loading state and the browser refetches everything
    // the server could have sent. Declaring it on the route keeps the knowledge
    // of what a page needs next to the page.
    for (const match of matchRoutes(routes, new URL(request.url).pathname) ?? []) {
        const handle = match.route.handle as { prefetch?: RoutePrefetch } | undefined;

        for (const thunk of handle?.prefetch?.(request) ?? []) {
            store.dispatch(thunk as Parameters<typeof store.dispatch>[0]);
        }
    }

    const tree = (
        <StrictMode>
            <Provider store={store}>
                <StaticRouterProvider router={router} context={context} />
            </Provider>
        </StrictMode>
    );

    let html = renderToString(tree);
    const pending = store.dispatch(baseHandler.util.getRunningQueriesThunk());

    if (pending.length > 0) {
        await Promise.all(pending);
        html = renderToString(tree);
    }

    const preloadedState: RootState = store.getState();

    return { html, preloadedState, status: statusFor(request) };
};
