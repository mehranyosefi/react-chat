import { Message } from "../../services/message/message.type";
import { receiveMessage ,receiveUpdatedMessage , receiveDeletedMessage } from "../../features/message/messageSlice"
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

  dispatch(connectionStarted())
  //main event
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

  //messages event
  const handleNewMessage = (message: Message) => {
    dispatch(receiveMessage(message));
  };

  const handleUpdatedMessage = (message:Message)=>{
    dispatch(receiveUpdatedMessage(message))
  };

  const handleDeletedMessage =(payload:{messageId:string , conversationId:string})=>{
    dispatch(receiveDeletedMessage(payload))
  };

  //conversation event
  const handleConversationJoin = (conversationId: string) => {
    console.log(`Joined conversation with ID: ${conversationId}`);
  };

  //main event listeners
  socket.on("connect", handleConnect);
  socket.on("disconnect", handleDisconnect);
  socket.on("connect_error", handleConnectError);
  socket.on("message:edited", handleUpdatedMessage);
  socket.on("message:deleted", handleDeletedMessage);

  

  //conversation
  socket.on("conversation:join", handleConversationJoin);

  //messages event listeners
  socket.on("message:new", handleNewMessage);

  


  return () => {
    socket.off("connect", handleConnect);
    socket.off("disconnect", handleDisconnect);
    socket.off("connect_error", handleConnectError);
    socket.off("message:new", handleNewMessage);
    socket.off("message:edited", handleUpdatedMessage);
    socket.off("message:deleted", handleDeletedMessage);
  };
}
