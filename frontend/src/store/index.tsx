import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    type Storage,
} from 'redux-persist';

import baseHandler, { type ApiExtra } from '@/lib/handlers/baseHandler';

import genReducer from './slices/genSlice';
import userReducer from './slices/userSlice';

/**
 * localStorage on the client, a no-op on the server.
 *
 * SSR has no localStorage, and redux-persist would throw reaching for it. The
 * server simply renders the default theme; the pre-paint script in index.html
 * has already painted the stored one, so nothing flashes.
 */
const storage: Storage = typeof window === 'undefined'
    ? {
        getItem: () => Promise.resolve(null),
        setItem: (_key, value) => Promise.resolve(value),
        removeItem: () => Promise.resolve(),
    }
    : {
        getItem: (key) => Promise.resolve(localStorage.getItem(key)),
        setItem: (key, value) => {
            localStorage.setItem(key, value);
            return Promise.resolve(value);
        },
        removeItem: (key) => {
            localStorage.removeItem(key);
            return Promise.resolve();
        },
    };

/**
 * Only `gen` is persisted. Auth state deliberately is not: localStorage has no
 * expiry, so a persisted `isAuthenticated` would outlive the cookies and leave
 * the UI insisting you are signed in while every request 401s.
 */
const persistedGenReducer = persistReducer({ key: 'gen', storage }, genReducer);

const rootReducer = combineReducers({
    gen: persistedGenReducer,
    user: userReducer,
    [baseHandler.reducerPath]: baseHandler.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export interface StoreOptions {
    preloadedState?: Partial<RootState>;
    cookie?: string;
}

export const makeStore = ({ preloadedState, cookie }: StoreOptions = {}) => configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        thunk: { extraArgument: { cookie } satisfies ApiExtra },
        // redux-persist dispatches these with non-serialisable payloads.
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }).concat(baseHandler.middleware),
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

export default makeStore;
