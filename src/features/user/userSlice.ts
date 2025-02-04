import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  session?: {
    access_token: string | null;
    refresh_token: string | null;
  };
}

const initialState = {
  email: "",
  session: {
    access_token: localStorage.getItem("access_token") || null,
    refresh_token: localStorage.getItem("refresh_token") || null,
  },
} satisfies UserState as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserState>) {
      state.email = action.payload.email;
      if (action.payload.session) state.session = action.payload.session;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
