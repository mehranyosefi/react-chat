import { apiClient } from "../../features/api/apiClient";
import { ApiRequestConfig } from "../../features/api/apiClient.type";
import {
  ConversationsResponse,
  ConversationResponse
} from "./conversation.type";

export function getConversations(): Promise<ConversationsResponse> {
  return apiClient<ConversationsResponse>("conversations", {
    authorizationRequired: true,
  });
}
export function getConversationById(conversationId: string, config?: ApiRequestConfig): Promise<ConversationResponse> {
  return apiClient<ConversationResponse>(`conversations/${ conversationId }`, {
    ...config,
    authorizationRequired: true,
  });
}
export function getConversationBycontactId(contactId: string, config?: ApiRequestConfig): Promise<ConversationResponse> {
  return apiClient<ConversationResponse>(`conversations/get-by-contact-id/${ contactId }`, {
    ...config,
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