import { apiClient } from "../../features/api/apiClient";
import { ApiRequestConfig } from "../../features/api/apiClient.type";
import {
  MessageResponse,
  CreateMessagePayload,
  UpdateMessagePayload,
  MessagesResponse,
} from "./message.type";

export function getMessagesByConversation(
  conversationId: string,
  config?: ApiRequestConfig
): Promise<MessagesResponse> {
  return apiClient<MessagesResponse>(`messages/conversation/${conversationId}`, {
    ...config,
    authorizationRequired: true,
  });
}

export function createMessage(
  payload: CreateMessagePayload,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>("messages", {
    method: "POST",
    body: payload,
    authorizationRequired: true,
  });
}

export function updateMessage(
  id: string,
  payload: UpdateMessagePayload,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>(`messages/${id}`, {
    method: "PATCH",
    body: payload,
    authorizationRequired: true,
  });
}

export function deleteMessage(id: string): Promise<void> {
  return apiClient<void>(`messages/${id}`, {
    method: "DELETE",
    authorizationRequired: true,
  });
}