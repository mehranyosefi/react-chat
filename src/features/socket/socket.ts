import { io, Socket } from "socket.io-client";
import { getAccessToken } from "../../utility/auth/tokenStorage";

const SOCKET_URL = import.meta.env.NODE_ENV === 'production' ? undefined : import.meta.env.VITE_SOCKET_URL;
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  auth: {
    token: getAccessToken()
  }
});