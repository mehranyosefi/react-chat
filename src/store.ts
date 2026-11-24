
import {
  configureStore,
  combineReducers,
  UnknownAction,
} from "@reduxjs/toolkit";

import userReducer from "./features/user/userSlice";
import tabReducer from "./features/tab/tabSlice";
import contactReducer from "./features/contact/contactSlice";
import socketReducer from "./features/socket/socketSlice";
import conversationReducer from "./features/conversation/conversationSlice";
import messageReducer from "./features/message/messageSlice";
import authReducer, { logout } from "./features/auth/authSlice";

const appReducer = combineReducers({
  user: userReducer,
  tab: tabReducer,
  contact: contactReducer,
  socket: socketReducer,
  conversation: conversationReducer,
  message: messageReducer,
  auth: authReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: UnknownAction
) => {
  if (logout.match(action)) {
    console.log("BEFORE RESET:", state);
    state = undefined;

    console.log("AFTER RESET:", state);
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
