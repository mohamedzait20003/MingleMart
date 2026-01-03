import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";

import { authApi } from "./apis/authApi";


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

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;