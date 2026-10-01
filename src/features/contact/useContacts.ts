// src/features/contacts/useContacts.ts
import { useCallback } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { getContactsThunk, createContactThunk, updateContactThunk, deleteContactThunk } from "./contactSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useContacts() {
  const dispatch = useAppDispatch();
  const { contacts, status, error } = useAppSelector((state) => state.contact);

  const refresh = useCallback(
    (force: boolean = false) => {
      return dispatch(getContactsThunk({ force }));
    },
    [dispatch]
  );
    const createContact = useCallback(
    (data: { name: string; email: string }) =>
      dispatch(createContactThunk(data)).unwrap(),
    [dispatch]
  );

  const updateContact = useCallback(
    (id: string, data: { name: string; email: string }) =>
      dispatch(updateContactThunk({ id, data })).unwrap(),
    [dispatch]
  );


  const deleteContact = useCallback(
    (id: string) => {
      return dispatch(deleteContactThunk(id));
    },
    [dispatch]
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
    deleteContact
  };
}