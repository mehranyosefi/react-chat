import { createAsyncThunk, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { Message } from "../../services/message/message.type";
import type { MessagesState, MessageEntity } from "./index.type";
import {
  getMessagesByConversation,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../../services/message/message.api";

function getErrorMessage(error: unknown): string {
  const apiError = error as {
    message?: string;
    response?: { data?: { message?: string } };
  };
  return apiError.response?.data?.message ?? apiError.message ?? "An error occurred";
}

const initialState: MessagesState = {
  byConversationId: {},

  fetchStatusByConversationId: {},
  fetchErrorByConversationId: {},

  sendStatusByUserId: {},
  sendErrorByUserId: {},

  updateStatusByMessageId: {},
  updateErrorByMessageId: {},

  deleteStatusByMessageId: {},
  deleteErrorByMessageId: {},
};

/* Fetch messages for a conversation (cached with condition) */
export const getMessagesThunk = createAsyncThunk<
  { conversationId: string; messages: Message[] },
  { conversationId: string; force?: boolean },
  { state: RootState; rejectValue: string }
>(
  "message/getMessagesByConversation",
  async ({ conversationId }, { rejectWithValue }) => {
    try {
      const { data } = await getMessagesByConversation(conversationId);
      return { conversationId, messages: data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: ({ conversationId, force }, { getState }) => {
      const state = getState().message;
      const status = state.fetchStatusByConversationId[conversationId] ?? "idle";
      if (status === "loading") return false;
      if (status === "succeeded" && !force) return false;
      return true;
    },
  }
);

/**
 * 2) Send message with optimistic UI:
 *    - reducer adds a pending message immediately
 *    - thunk calls API
 *    - on success replaces optimistic message with server message
 */
export const sendMessageThunk = createAsyncThunk<
  { conversationId: string; userId: string; serverMessage: Message },
  { conversationId: string; content: string; userId: string },
  { rejectValue: { userId: string; message: string } }
>(
  "message/sendMessage",
  async ({ conversationId, content, userId }, { rejectWithValue }) => {
    try {
      const res = await createMessage({ conversationId, content });
      return { conversationId, userId, serverMessage: res.data };
    } catch (error) {
      return rejectWithValue({ userId, message: getErrorMessage(error) });
    }
  }
);

/** Update message */
export const updateMessageThunk = createAsyncThunk<
  Message,
  { messageId: string; content: string },
  { rejectValue: { messageId: string; message: string } }
>("message/updateMessage", async ({ messageId, content }, { rejectWithValue }) => {
  try {
    const res = await updateMessage(messageId, { content });
    return res.data;
  } catch (error) {
    return rejectWithValue({ messageId, message: getErrorMessage(error) });
  }
});

/* Delete message */
export const deleteMessageThunk = createAsyncThunk<
  { messageId: string; conversationId: string },
  { messageId: string; conversationId: string },
  { rejectValue: { messageId: string; message: string } }
>("message/deleteMessage", async ({ messageId, conversationId }, { rejectWithValue }) => {
  try {
    await deleteMessage(messageId);
    return { messageId, conversationId };
  } catch (error) {
    return rejectWithValue({ messageId, message: getErrorMessage(error) });
  }
});

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    /** Optimistic insert (call before sendMessageThunk) */
    addOptimisticMessage: {
      reducer: (
        state,
        action: PayloadAction<{ conversationId: string; optimistic: MessageEntity }>
      ) => {
        const { conversationId, optimistic } = action.payload;
        if (!state.byConversationId[conversationId]) state.byConversationId[conversationId] = [];
        state.byConversationId[conversationId].push(optimistic);

        if (optimistic.userId) {
          state.sendStatusByUserId[optimistic.userId] = "loading";
          state.sendErrorByUserId[optimistic.userId] = null;
        }
      },
      prepare: (conversationId: string, content: string, sender: string) => {
        const userId = nanoid();
        const now = new Date().toISOString();

        // local shape mimics server message as much as possible
        const optimistic: MessageEntity = {
          _id: userId, // temporary id for rendering keys
          userId,
          pending: true,
          error: null,

          conversation: conversationId,
          sender,
          type: "text",
          content,
          status: "sent",
          createdAt: now,
          updatedAt: now,
          __v: 0,
        };

        return { payload: { conversationId, optimistic } };
      },
    },

    /**
     * If user wants to retry a failed optimistic message, you can remove & resend
     */
    removeMessageByUserId: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const { conversationId, userId } = action.payload;
      state.byConversationId[conversationId] = (state.byConversationId[conversationId] ?? []).filter(
        (m) => m.userId !== userId
      );
      delete state.sendStatusByUserId[userId];
      delete state.sendErrorByUserId[userId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(getMessagesThunk.pending, (state, action) => {
        const { conversationId } = action.meta.arg;
        state.fetchStatusByConversationId[conversationId] = "loading";
        state.fetchErrorByConversationId[conversationId] = null;
      })
      .addCase(getMessagesThunk.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        state.fetchStatusByConversationId[conversationId] = "succeeded";
        state.byConversationId[conversationId] = messages;
      })
      .addCase(getMessagesThunk.rejected, (state, action) => {
        const { conversationId } = action.meta.arg;
        state.fetchStatusByConversationId[conversationId] = "failed";
        state.fetchErrorByConversationId[conversationId] =
          (action.payload as string) ?? action.error.message ?? "Error fetching messages";
      })

      // Send message
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        const { conversationId, userId, serverMessage } = action.payload;

        state.sendStatusByUserId[userId] = "succeeded";
        state.sendErrorByUserId[userId] = null;

        const list = state.byConversationId[conversationId] ?? [];
        const idx = list.findIndex((m) => m.userId === userId || m._id === userId);

        if (idx >= 0) {
          list[idx] = serverMessage; // replace optimistic
        } else {
          // fallback if optimistic not found
          list.push(serverMessage);
        }

        state.byConversationId[conversationId] = list;
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        const payload = action.payload;
        if (!payload) return;

        state.sendStatusByUserId[payload.userId] = "failed";
        state.sendErrorByUserId[payload.userId] = payload.message;

        // mark optimistic message as failed
        for (const convId of Object.keys(state.byConversationId)) {
          const list = state.byConversationId[convId] ?? [];
          const msg = list.find((m) => m.userId === payload.userId || m._id === payload.userId);
          if (msg) {
            msg.pending = false;
            msg.error = payload.message;
            break;
          }
        }
      })

      // Update message
      .addCase(updateMessageThunk.pending, (state, action) => {
        const { messageId } = action.meta.arg;
        state.updateStatusByMessageId[messageId] = "loading";
        state.updateErrorByMessageId[messageId] = null;
      })
      .addCase(updateMessageThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        const conversationId = updated.conversation;

        state.updateStatusByMessageId[updated._id] = "succeeded";
        state.updateErrorByMessageId[updated._id] = null;

        const list = state.byConversationId[conversationId] ?? [];
        const idx = list.findIndex((m) => m._id === updated._id);
        if (idx >= 0) list[idx] = { ...list[idx], ...updated, pending: false, error: null };
      })
      .addCase(updateMessageThunk.rejected, (state, action) => {
        const payload = action.payload;
        if (!payload) return;
        state.updateStatusByMessageId[payload.messageId] = "failed";
        state.updateErrorByMessageId[payload.messageId] = payload.message;
      })

      // Delete message
      .addCase(deleteMessageThunk.pending, (state, action) => {
        const { messageId } = action.meta.arg;
        state.deleteStatusByMessageId[messageId] = "loading";
        state.deleteErrorByMessageId[messageId] = null;
      })
      .addCase(deleteMessageThunk.fulfilled, (state, action) => {
        const { messageId, conversationId } = action.payload;

        state.deleteStatusByMessageId[messageId] = "succeeded";
        state.deleteErrorByMessageId[messageId] = null;

        state.byConversationId[conversationId] = (state.byConversationId[conversationId] ?? []).filter(
          (m) => m._id !== messageId
        );
      })
      .addCase(deleteMessageThunk.rejected, (state, action) => {
        const payload = action.payload;
        if (!payload) return;
        state.deleteStatusByMessageId[payload.messageId] = "failed";
        state.deleteErrorByMessageId[payload.messageId] = payload.message;
      });
  },
});

export const { addOptimisticMessage, removeMessageByUserId } = messageSlice.actions;
export default messageSlice.reducer;
