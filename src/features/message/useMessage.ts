import { useCallback, useMemo } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  addOptimisticMessage,
  getMessagesThunk,
  sendMessageThunk,
  updateMessageThunk,
  deleteMessageThunk,
} from "./messageSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const EMPTY_MESSAGES: readonly any[] = Object.freeze([]);

export interface SendMessageOptions {
  conversationId?: string;
  currentUserId?: string;
}

export function useMessage(conversationId?: string, currentUserId?: string) {
  const dispatch = useAppDispatch();

  // 1. Messages scoped to current conversation (stable reference fallback)
  const messages = useAppSelector((state) =>
    conversationId
      ? (state.message.byConversationId[conversationId] ?? EMPTY_MESSAGES)
      : EMPTY_MESSAGES
  );

  // 2. Fetch statuses
  const fetchStatus = useAppSelector((state) =>
    conversationId ? (state.message.fetchStatusByConversationId[conversationId] ?? "idle") : "idle"
  );

  const fetchError = useAppSelector((state) =>
    conversationId ? (state.message.fetchErrorByConversationId[conversationId] ?? null) : null
  );

  // 3. Send/Mutation status (if tracked in messageSlice)
  const isSending = useAppSelector((state) => state.message.isSending ?? false);

  const loading = fetchStatus === "loading";

  // 4. Lazy & Dynamic getMessages
  const getMessages = useCallback(
    (force = false, targetConversationId?: string) => {
      const activeConvId = targetConversationId || conversationId;
      if (!activeConvId) return;

      return dispatch(getMessagesThunk({ conversationId: activeConvId, force }));
    },
    [dispatch, conversationId]
  );

  // 5. Lazy & Dynamic sendMessage
  const sendMessage = useCallback(
    async (content: string, options?: SendMessageOptions) => {
      const activeConvId = options?.conversationId || conversationId;
      const activeUserId = options?.currentUserId || currentUserId;

      if (!activeConvId || !activeUserId) {
        throw new Error("Cannot send message: conversationId or activeUserId are required.");
      }

      // 1) Add optimistic message to Redux store
      const action = dispatch(addOptimisticMessage(activeConvId, content, activeUserId));

      // Extract resolved sender/userId from payload or fallback to activeUserId
      const resolvedUserId = action.payload?.optimistic?.userId ?? activeUserId;

      // 2) Dispatch API thunk
      return dispatch(
        sendMessageThunk({
          conversationId: activeConvId,
          content,
          userId: resolvedUserId,
        })
      ).unwrap();
    },
    [dispatch, conversationId, currentUserId]
  );

  // 6. Update message
  const updateMessage = useCallback(
    (messageId: string, content: string) => {
      return dispatch(updateMessageThunk({ messageId, content })).unwrap();
    },
    [dispatch]
  );

  // 7. Remove message with lazy conversationId fallback
  const removeMessage = useCallback(
    (messageId: string, targetConversationId?: string) => {
      const activeConvId = targetConversationId || conversationId;
      if (!activeConvId) {
        throw new Error("Cannot delete message: conversationId is required.");
      }

      return dispatch(
        deleteMessageThunk({
          messageId,
          conversationId: activeConvId,
        })
      ).unwrap();
    },
    [dispatch, conversationId]
  );

  return useMemo(
    () => ({
      messages,
      fetchStatus,
      fetchError,
      loading,
      isSending,
      getMessages,
      sendMessage,
      updateMessage,
      removeMessage,
    }),
    [
      messages,
      fetchStatus,
      fetchError,
      loading,
      isSending,
      getMessages,
      sendMessage,
      updateMessage,
      removeMessage,
    ]
  );
}
