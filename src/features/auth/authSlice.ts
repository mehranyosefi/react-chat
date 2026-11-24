import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./index.type";
const initialState:AuthState = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens(state, action: PayloadAction<AuthState>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearAuthTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },
    logout: () => initialState,
  },
});

export const { setAuthTokens, clearAuthTokens, logout } = authSlice.actions;
export default authSlice.reducer;