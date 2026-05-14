import { Provider } from 'react-redux';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { hydrateRoot } from 'react-dom/client';
import { StrictMode, startTransition } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { routes } from './routes';
import store from './store';
import Client from './components/Client';

const router = createBrowserRouter(routes);

// Create client-side Emotion cache (matches server cache key)
const cache = createCache({ key: 'css' });

startTransition(() => {
  hydrateRoot(
    document.getElementById('root')!, 
    <StrictMode>
      <CacheProvider value={cache}>
        <Provider store={store}>
          <Client>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
              <RouterProvider router={router} />
            </GoogleOAuthProvider>
          </Client>
        </Provider>
      </CacheProvider>
    </StrictMode>
  );
});
