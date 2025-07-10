// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "../features/auth/authSlice";
import bookingReducer from "../features/slices/bookingSlice";
import { authApi } from "../features/api/authApi";
import { 
  usersApi,
  hotelsApi,
  roomsApi,
  bookingsApi,
  paymentsApi,
  ticketsApi
} from "../features/api";
import { amenitiesApi } from "../features/api/amenitiesApi";
import { addressesApi } from "../features/api/addressesApi";
import { entityAmenitiesApi } from "../features/api/entityAmenitiesApi";
import { uploadApi } from "../features/api/imageUploadApi";

// Auth persist config
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["firstName", "email", "token", "userId", "userType", "isAuthenticated"]
};

const persistAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    // API reducers
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [hotelsApi.reducerPath]: hotelsApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [ticketsApi.reducerPath]: ticketsApi.reducer,
    [amenitiesApi.reducerPath]: amenitiesApi.reducer,
    [addressesApi.reducerPath]: addressesApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [entityAmenitiesApi.reducerPath]: entityAmenitiesApi.reducer,
    
    // Regular reducers
    auth: persistAuthReducer,
    booking: bookingReducer
  },

  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    }).concat(
      authApi.middleware,
      usersApi.middleware,
      hotelsApi.middleware,
      roomsApi.middleware,
      bookingsApi.middleware,
      paymentsApi.middleware,
      amenitiesApi.middleware,
      addressesApi.middleware,
      uploadApi.middleware,
      entityAmenitiesApi.middleware,
      ticketsApi.middleware
    ),
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;