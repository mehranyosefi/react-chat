import { apiClient } from "../../features/api/apiClient";
import {
  ConversationsResponse,
  ConversationResponse,
} from "./conversation.type";

export function getConversations(): Promise<ConversationsResponse> {
  return apiClient<ConversationsResponse>("conversations", {
    authorizationRequired: true,
  });
}

export function createConversation(
  participantId: string,
): Promise<ConversationResponse> {
  return apiClient<ConversationResponse>("conversations", {
    method: "POST",
    body: {
      participantId,
    },
    authorizationRequired: true,
  });
}

export function deleteConversation(participantId: string): Promise<void> {
  return apiClient<void>("conversations", {
    method: "DELETE",
    body: {
      participantId,
    },
    authorizationRequired: true,
  });
}