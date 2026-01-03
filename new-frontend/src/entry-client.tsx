import { Provider } from 'react-redux';
import createCache from '@emotion/cache';
import { persistStore } from 'redux-persist';
import { CacheProvider } from '@emotion/react';
import { hydrateRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { StrictMode, startTransition, useEffect, type ReactNode } from 'react';

import { routes } from './routes';
import store from './store';

const router = createBrowserRouter(routes);

// Create client-side Emotion cache (matches server cache key)
const cache = createCache({ key: 'css' });

const ClientOnly = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const persistor = persistStore(store);
    persistor.persist();
  }, []);

  return <>{children}</>;
}

startTransition(() => {
  hydrateRoot(
    document.getElementById('root')!, 
    <StrictMode>
      <CacheProvider value={cache}>
        <Provider store={store}>
          <ClientOnly>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
              <RouterProvider router={router} />
            </GoogleOAuthProvider>
          </ClientOnly>
        </Provider>
      </CacheProvider>
    </StrictMode>
  );
});
