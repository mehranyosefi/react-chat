import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SocketState } from "./index.type";

const initialState: SocketState = {
  connected: false,
  connecting: false,
  error: null,
};


const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        connectionStarted(state) {
            state.connecting = true
            state.error = null
        },
        connected(state){
            state.connected = true
            state.connecting = false
            state.error = null
        },
        disconnected(state) {
            state.connected = false;
            state.connecting = false
        },
        connectionError(state, action: PayloadAction<string>) {
            state.connected =false
            state.connecting = false
            state.error = action.payload
        },
    }
})

export const {
  connectionStarted,
  connected,
  disconnected,
  connectionError,
} = socketSlice.actions;

export default socketSlice.reducer