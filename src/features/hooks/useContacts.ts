import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { setContacts, setLoading } from "../contact/contactSlice";
import { getContacts, deleteContact } from "../../services/contact/contact.api";


export function useContacts() {
  const dispatch = useDispatch<AppDispatch>();

const contacts = useSelector(
  (state: RootState) => state.contact.contacts
);

const loading = useSelector(
  (state: RootState) => state.contact.loading
);

  useEffect(() => {
    getContactsList();
  }, []);

  async function getContactsList() {
    try {
      console.log("refresh contact called");
      const res = await getContacts();
      console.log("Contacts fetched:", res.data);
      dispatch(setContacts(res.data));
      console.log("Contacts state updated:", res.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      dispatch(setLoading(false));
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
