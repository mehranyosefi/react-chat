import { createContext, useContext } from "react";

export const CreateContactContext = createContext<(() => void) | null>(null);

export function useOpenCreateContact() {
  const openCreateContact = useContext(CreateContactContext);

  if (openCreateContact === null) {
    throw new Error("useOpenCreateContact must be used inside CreateContactContext.Provider");
  }

  return openCreateContact;
}
