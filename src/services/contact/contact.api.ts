import { apiClient } from "../../features/api/apiClient";
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

export function getContactById(id: string): Promise<ContactResponse> {
  return apiClient<ContactResponse>(`contacts/${id}`, {
    authorizationRequired: true,
  });
}

export function createContact(
  payload: CreateContactPayload,
): Promise<ContactResponse> {
  return apiClient<ContactResponse>("contacts", {
    method: "POST",
    body: payload,
    authorizationRequired: true,
  });
}

export function updateContact(
  id: string,
  payload: UpdateContactPayload,
): Promise<ContactResponse> {
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
