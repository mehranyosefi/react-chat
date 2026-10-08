import { socket } from "./socket";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useEffect } from "react";
import { getAccessToken } from "../../utility/auth/tokenStorage";
import { registerSocketEvents } from "./socketEvents";

const useAppDispatch = () => useDispatch<AppDispatch>();

export function useSocket() {
  const access_token = getAccessToken();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!access_token)
       return;

    const cleanup = registerSocketEvents(dispatch);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      cleanup();
    };
  }, [dispatch, access_token]);

  return socket;
}
