import { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../../services/contact/contact.api";
import { Contact } from "../../services/contact/contact.type";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContactsList();
  }, []);

  async function getContactsList() {
    try {
      const res = await getContacts();
      setContacts(res.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteContact(id: string) {
    try {
      await deleteContact(id);
      await getContactsList();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }

  return { contacts, loading, refresh: getContactsList, deleteContact:handleDeleteContact };
}
