import ContactItem from "./ContactItem";
import { useContacts } from "../../features/contact/useContacts";
import { useEffect } from "react";
function ContactList() {
  const { contacts, loading, status, refresh, deleteContact } = useContacts();

 useEffect(() => {
    if (status === "idle") {
      refresh();
    }
  }, [status, refresh]);


  
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
                  isLast={index === contacts.length - 1}
                  onDelete={deleteContact}
                  handleRefreshItem={refresh}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default ContactList;
