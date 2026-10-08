export interface SocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  onlineUsers: string[];
}