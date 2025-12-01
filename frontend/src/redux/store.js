// src/redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Reducer for user authentication & info
import videosReducer from "./videosSlice"; // Reducer for handling all videos
import videoReducer from "./videoSlice"; // Reducer for single video details

import {
  persistStore, // Creates a persisted store
  persistReducer, // Wraps reducers to enable persistence
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // Default localStorage for web

// Configuration for redux-persist
const persistConfig = {
  key: "root", // Key for localStorage
  storage, // Storage engine
  whitelist: ["user"], // Only persist user slice
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  videos: videosReducer,
  video: videoReducer,
});

// Wrap rootReducer with persistReducer for persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions in serializable check
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor to persist the store
export const persistor = persistStore(store);
