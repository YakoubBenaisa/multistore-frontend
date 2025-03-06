import { configureStore } from "@reduxjs/toolkit";
/*import themeReducer  from "../shared/states/darkmode/themeSlice";
import  AuthReducer  from "../modules/auth/states/auth";
import userReducer from "../shared/states/user/userSlice";*/
import { persistStore } from "redux-persist";
import { persistedReducer } from "./Reducers/PresistReducer";
/*export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: AuthReducer,
    user: userReducer,
  }
});
*/
// Create the store using the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

// Create the persistor for use with PersistGate
export const persistor = persistStore(store);



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
