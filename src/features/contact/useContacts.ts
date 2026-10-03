// src/features/contacts/useContacts.ts
import { useCallback } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  getContactsThunk,
  createContactThunk,
  updateContactThunk,
  deleteContactThunk,
} from "./contactSlice";
import type { CreateContactInput, UpdateContactInput } from "./index.type";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useContacts() {
  const dispatch = useAppDispatch();
  const { contacts, status, error } = useAppSelector((state) => state.contact);

  const refresh = useCallback(
    (force: boolean = false) => {
      return dispatch(getContactsThunk({ force }));
    },
    [dispatch],
  );
  const createContact = useCallback(
    (data: CreateContactInput) =>
      dispatch(createContactThunk(data)).unwrap(),
    [dispatch],
  );

  const updateContact = useCallback(
    (id: string, data: UpdateContactInput) =>
      dispatch(updateContactThunk({ id, data })).unwrap(),
    [dispatch],
  );

  const deleteContact = useCallback(
    (id: string) => {
      return dispatch(deleteContactThunk(id));
    },
    [dispatch],
  );

  return {
    contacts,
    status,
    loading: status === "loading",
    isIdle: status === "idle",
    error,
    refresh,
    createContact,
    updateContact,
    deleteContact,
  };
}
