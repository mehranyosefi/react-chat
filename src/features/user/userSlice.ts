import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  name: string;
}

const initialState = {
  email: "",
  name: ""
} satisfies UserState as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserState>) {
      state.email = action.payload.email;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
