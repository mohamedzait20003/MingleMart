import './index.css';

import { StrictMode } from 'react'
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import store from './store';
import router from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
