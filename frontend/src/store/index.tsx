import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, type Storage } from "redux-persist";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";

import authApi from "./apis/authApi";
import userApi from "./apis/userApi";

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

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["token", "role", "isVerified", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const userPersistConfig = {
    key: "user",
    storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        user: persistedUserReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(authApi.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;