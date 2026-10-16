import { io, Socket } from "socket.io-client";
import { getAccessToken } from "../../utility/auth/tokenStorage";

const SOCKET_URL =
  import.meta.env.NODE_ENV === "production" ? undefined : import.meta.env.VITE_SOCKET_URL;
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  auth: (cb) => {
    cb({ token: getAccessToken() });
  },
});

/**
 * Promise-based emit helper with timeout protection
 */
export function emitWithTimeout<TResponse>(
  event: string,
  data: unknown,
  timeoutMs = 10000
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    if (!socket.connected) {
      return reject(new Error("Socket is not connected."));
    }

    const timer = setTimeout(() => {
      reject(new Error("Request timed out."));
    }, timeoutMs);

    socket.emit(event, data, (response: { success: boolean; data?: TResponse; error?: string }) => {
      clearTimeout(timer);

      // Handle backend response format: e.g. { success: true, data: Message }
      if (response && response.success === false) {
        reject(new Error(response.error || "Failed to send message"));
      } else {
        resolve((response?.data ?? response) as TResponse);
      }
    });
  });
}
