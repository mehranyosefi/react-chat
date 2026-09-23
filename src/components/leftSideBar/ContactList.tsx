import ContactItem from "./ContactItem";
import { Contact } from "../../services/contact/contact.type";

function ContactList({contacts, loading, onDelete , handleRefreshItem}: { contacts: Contact[]; loading: boolean; onDelete: (id: string) => void; handleRefreshItem: () => void }) {

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
                  onDelete={onDelete}
                  handleRefreshItem={handleRefreshItem}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default ContactList;
