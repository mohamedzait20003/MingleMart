import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom";
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

import { routes } from "./routes";
import store from './store';

export const render = async (url: string) => {
    const handler = createStaticHandler(routes);
    const context = await handler.query(new Request(`http://localhost${url}`))

    if (context instanceof Response) {
        throw context;
    }

    const router = createStaticRouter(handler.dataRoutes, context)

    const cache = createCache({ key: 'css' });
    cache.compat = true;
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

    const preloadedState = store.getState();

    const html = renderToString(
        <StrictMode>
            <CacheProvider value={cache}>
                <Provider store={store}>
                    <StaticRouterProvider router={router} context={context} />
                </Provider>
            </CacheProvider>
        </StrictMode>
    );

    const emotionChunks = extractCriticalToChunks(html);
    const styles = constructStyleTagsFromChunks(emotionChunks);

    return { html, styles, preloadedState }
};
