import { apiClient } from "../../features/api/apiClient";
import { ApiRequestConfig } from "../../features/api/apiClient.type";
import {
  ContactsResponse,
  ContactResponse,
  CreateContactPayload,
  UpdateContactPayload,
} from "./contact.type";

export function getContacts(): Promise<ContactsResponse> {
  return apiClient<ContactsResponse>("contacts", {
    authorizationRequired: true,
  });
}

export function getContactById(id: string, config?: ApiRequestConfig): Promise<ContactResponse> {
  return apiClient<ContactResponse>(`contacts/${id}`, {
    ...config,
    authorizationRequired: true,
  });
}

export function createContact(payload: CreateContactPayload): Promise<ContactResponse> {
  return apiClient<ContactResponse>("contacts", {
    method: "POST",
    body: payload,
    authorizationRequired: true,
  });
}

export function updateContact(id: string, payload: UpdateContactPayload): Promise<ContactResponse> {
  return apiClient<ContactResponse>(`contacts/${id}`, {
    method: "PATCH",
    body: payload,
    authorizationRequired: true,
  });
}

export function deleteContact(id: string): Promise<void> {
  return apiClient<void>(`contacts/${id}`, {
    method: "DELETE",
    authorizationRequired: true,
  });
}
