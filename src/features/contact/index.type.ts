import { Contact } from "../../services/contact/contact.type";
type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
export interface ContactState {
  contacts: Contact[];
  status: RequestStatus;
  error: string | null;
  createStatus: RequestStatus;
  createError: string | null;
  updateStatus: RequestStatus;
  updateError: string | null;
}
export type CreateContactInput  = {
  name: string;
  email: string;
};

export type UpdateContactInput = {
  name: string;
};