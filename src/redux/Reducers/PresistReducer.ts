// store.ts
import {  combineReducers } from "@reduxjs/toolkit";
import {  persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import storeReducer from '../../modules/store/states/storeSlice'
import themeReducer from "../../shared/states/darkmode/themeSlice";
import AuthReducer from "../../modules/auth/states/auth";
import userReducer from "../../shared/states/user/userSlice";

// Combining reducers into a single root reducer
const rootReducer = combineReducers({
  theme: themeReducer,
  auth: AuthReducer,
  user: userReducer,
  store: storeReducer
});

// Set up the persist configuration
const persistConfig = {
  key: "root",
  storage,
  // Optionall whitelisting (null=> all presistent) or blacklisting (null=> none presistent)
  // whitelist: ["theme", "auth", "user"],
};

// Wrap root reducer with persistReducer
export const persistedReducer = persistReducer(persistConfig, rootReducer);

