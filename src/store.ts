import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import tabReducer from "./features/tab/tabSlice";
import contactReducer from "./features/contact/contactSlice"
import socketReducer from "./features/socket/socketSlice"
import conversationReducer from "./features/conversation/conversationSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    tab: tabReducer,
    contact :contactReducer,
    socket: socketReducer,
    conversation: conversationReducer
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
