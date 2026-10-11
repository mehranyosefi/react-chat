import { useCallback } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  getConversationsThunk,
  createConversationThunk,
  deleteConversationThunk,
} from "./conversationSlice";
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useConversations() {
  const dispatch = useAppDispatch();

  const { conversations, status, error, createStatus, createError } = useAppSelector(
    (state) => state.conversation
  );

  const refresh = useCallback(
    (force: boolean = false) => {
      return dispatch(getConversationsThunk({ force }));
    },
    [dispatch]
  );

  const createConversation = useCallback(
    (participantId: string) => dispatch(createConversationThunk(participantId)).unwrap(),
    [dispatch]
  );

  const deleteConversation = useCallback(
    (participantId: string) => dispatch(deleteConversationThunk(participantId)).unwrap(),
    [dispatch]
  );

  return {
    conversations,
    status,
    loading: status === "loading",
    isIdle: status === "idle",
    error,
    refresh,
    createConversation,
    deleteConversation,
    createStatus,
    createError,
  };
}
