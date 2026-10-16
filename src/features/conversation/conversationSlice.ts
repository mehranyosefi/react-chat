import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getConversations,
  createConversation,
  deleteConversation,
  getConversationBycontactId,
} from "../../services/conversation/conversation.api";
import type { RootState } from "../../store";
import type { Conversation } from "../../services/conversation/conversation.type";
import type { ConversationState } from "./index.type";
import { emitWithTimeout } from "../socket/socket";

const initialState: ConversationState = {
  conversations: [],
  status: "idle",
  error: null,

  createStatus: "idle",
  createError: null,
};

function getErrorMessage(error: unknown): string {
  const apiError = error as {
    message?: string;
    response?: { data?: { message?: string } };
  };

  return apiError.response?.data?.message ?? apiError.message ?? "An error occurred";
}

export const getConversationsThunk = createAsyncThunk<
  Conversation[],
  { force?: boolean } | undefined,
  { state: RootState }
>(
  "conversation/getConversations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getConversations();
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (args, { getState }) => {
      const { conversation } = getState();
      if (conversation.status === "loading") {
        return false;
      }
      if (conversation.status === "succeeded" && !args?.force) {
        return false;
      }
      return true;
    },
  }
);
export const getConversationBycontactIdThunk = createAsyncThunk(
  "conversations/get-conversation-by-id",
  async (contactId: string, { rejectWithValue }) => {
    try {
      const res = await getConversationBycontactId(contactId);
      return res.data;
    } catch (error) {
      rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createConversationThunk = createAsyncThunk<
  Conversation,
  string,
  { rejectValue: string }
>("conversation/createConversation", async (data, { rejectWithValue }) => {
  try {
    const res = await createConversation(data);
    return res.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const joinToConversationThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string } }
>("conversation/join", async (conversationId, { rejectWithValue }) => {
  //handle join to conversation via ws
  try {
    await emitWithTimeout("conversation:join", {
      conversationId
    });
    return conversationId ;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error)
    });
  }
});
export const leaveConversationThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string } }
>("conversation/join", async (conversationId, { rejectWithValue }) => {
  //handle join to conversation via ws
  try {
    await emitWithTimeout("conversation:leave", {
      conversationId
    });
    return conversationId ;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error)
    });
  }
});

export const deleteConversationThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  "conversations/removeConversation",
  async (participantId: string, { rejectWithValue }) => {
    try {
      await deleteConversation(participantId);
      return participantId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Fetch
      .addCase(getConversationsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getConversationsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(getConversationsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      //create
      .addCase(createConversationThunk.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createConversationThunk.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.conversations.push(action.payload);
      })
      .addCase(createConversationThunk.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload ?? action.error.message ?? "Error creating conversation";
      })

      //delete
      .addCase(deleteConversationThunk.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(
          (conversation) => !conversation.participants.includes(action.payload)
        );
      })

      //fetch conversatin by chat id
      .addCase(getConversationBycontactIdThunk.fulfilled, (state, action) => {
        if (action.payload) state.conversations.push(action.payload);
      });
  },
});

export default conversationSlice.reducer;
