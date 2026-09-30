import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import tabReducer from "./features/tab/tabSlice";
import contactReducer from "./features/contact/contactSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    tab: tabReducer,
    contact :contactReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
