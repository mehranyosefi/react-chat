import type { Message } from "../../services/message/message.type";

export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export type MessageEntity = Message & {
  userId?: string;
  pending?: boolean;
  error?: string | null;
};

export type MessagesState = {
  // messages grouped by conversationId
  byConversationId: Record<string, MessageEntity[]>;

  // Indicates whether older messages exist for each conversation
  hasMoreByConversationId: Record<string, boolean>;

  // Status of fetching older messages for each conversation
  olderMessagesStatusByConversationId: Record<string, AsyncStatus>;

  // fetch status per conversation
  fetchStatusByConversationId: Record<string, AsyncStatus>;
  fetchErrorByConversationId: Record<string, string | null>;

  // mutation status per message
  sendStatusByUserId: Record<string, AsyncStatus>;
  sendErrorByUserId: Record<string, string | null>;

  updateStatusByMessageId: Record<string, AsyncStatus>;
  updateErrorByMessageId: Record<string, string | null>;

  deleteStatusByMessageId: Record<string, AsyncStatus>;
  deleteErrorByMessageId: Record<string, string | null>;
};
