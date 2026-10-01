// src/features/contacts/useContacts.ts
import { useCallback } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchContacts, removeContact } from "./contactSlice";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useContacts() {
  const dispatch = useAppDispatch();
  const { contacts, status, error } = useAppSelector((state) => state.contact);

  const refresh = useCallback(
    (force: boolean = false) => {
      return dispatch(fetchContacts({ force }));
    },
    [dispatch]
  );

  const deleteContact = useCallback(
    (id: string) => {
      return dispatch(removeContact(id));
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
    deleteContact,
  };
}