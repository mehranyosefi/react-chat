import type { AppDispatch } from "../../store";
import { socket } from "./socket";

import {
  connected,
  connectionError,
  connectionStarted,
  disconnected,
} from "./socketSlice";

// import { messageReceived } from "../messages/messageSlice";

export function registerSocketEvents(dispatch: AppDispatch) {

  const handleConnect = () => {
    dispatch(connected());
    console.log('ws connected successfully')
  };
  const handleDisconnect = () => {
    dispatch(disconnected());
  };
  const handleConnectError = (error: Error) => {
    dispatch(connectionError(error.message));
  };
  dispatch(connectionStarted())
  
  //main event listeners
  socket.on("connect", handleConnect);
  socket.on("disconnect", handleDisconnect);
  socket.on("connect_error", handleConnectError);
  


  return () => {
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("connect_error", handleConnectError);
    // socket.off("message:new", handleNewMessage);
  };
}
