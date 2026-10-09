import { apiClient } from "../../features/api/apiClient";
import {
  MessageResponse,
  CreateMessagePayload,
  UpdateMessagePayload,
} from "./message.type";

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