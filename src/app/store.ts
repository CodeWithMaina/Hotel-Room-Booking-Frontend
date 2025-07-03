import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";
import authReducer from "../features/auth/authSlice"

// Auht persist config
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["email","token","userId","userType","isAuthenticated"]
};


const persistAuthReducer = persistReducer(authPersistConfig, authReducer)

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: persistAuthReducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;