/**
 * Redux Store Configuration
 * Configures the Redux store with Redux Toolkit
 */

import { configureStore } from "@reduxjs/toolkit";
import analyticsReducer from "./slices/analyticsSlice";

/**
 * Configure and create Redux store
 * Redux Toolkit automatically includes:
 * - Redux DevTools Extension
 * - Redux Thunk middleware
 * - Immutability checks (in development)
 * - Serializability checks (in development)
 */
const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
  },
  // Can add middleware here if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Customize default middleware if needed
      serializableCheck: {
        // Ignore these action types for serializability check
        ignoredActions: [],
      },
    }),
  // Enable Redux DevTools only in development
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
