import ContactItem from "./ContactItem";
import { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../../services/contact/contact.api";
import { Contact } from "../../services/contact/contact.type";

function ContactList({
  onRefreshReady,
}: {
  onRefreshReady?: (refreshFn: () => Promise<void>) => void;
}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContactsList();
    onRefreshReady?.(getContactsList);
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

  return (
    <div className="">
      {loading && <div className="flex justify-center py-5">Loading...</div>}
      <ul>
        {contacts &&
          contacts.map((contact, index) => {
            return (
              <li key={contact._id}>
                <ContactItem
                  id={contact._id}
                  name={contact.name}
                  contactId={contact.contact._id}
                  createdAt={contact.createdAt}
                  onDelete={handleDeleteContact}
                  isLast={index === contacts.length - 1}
                  handleRefreshItem={getContactsList}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default ContactList;
