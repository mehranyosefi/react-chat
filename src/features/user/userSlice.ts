import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  email: string;
  name: string;
}

const initialState = {
  id: "",
  email: "",
  name: "",
} satisfies UserState as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
    },

    clearUser(state) {
      state.id = "";
      state.email = "";
      state.name = "";
    },
  },
});

export const { setUserInfo, clearUser } = userSlice.actions;
export default userSlice.reducer;
