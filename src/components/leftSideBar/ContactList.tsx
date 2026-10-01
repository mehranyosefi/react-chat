import ContactItem from "./ContactItem";
import { useContacts } from "../../features/hooks/useContacts";
function ContactList() {
const { contacts, loading, refresh, deleteContact } = useContacts();
console.log("Contactlist rendered :", contacts);
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
