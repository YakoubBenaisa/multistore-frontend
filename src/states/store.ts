import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./Slices/themeSlice"
import  isLoggedReducer  from "./Slices/auth";
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: isLoggedReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
