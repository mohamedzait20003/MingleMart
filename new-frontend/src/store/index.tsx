import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, type Storage } from "redux-persist";

import authReducer from "./slices/authSlice";

import { authApi } from "./apis/authApi";

// SSR-safe storage - use a no-op storage on server
const createNoopStorage = (): Storage => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: string) {
            return Promise.resolve(value);
        },
        removeItem() {
            return Promise.resolve();
        },
    };
};

const isServer = typeof window === "undefined";

const storage: Storage = isServer ? createNoopStorage() : {
    getItem(key: string) {
        return Promise.resolve(localStorage.getItem(key));
    },
    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
        return Promise.resolve(value);
    },
    removeItem(key: string) {
        localStorage.removeItem(key);
        return Promise.resolve();
    },
};

const authpersistConfig = {
    key: "auth",
    storage,
    whitelist: ["token", "user", "role", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(authpersistConfig, authReducer);


const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;