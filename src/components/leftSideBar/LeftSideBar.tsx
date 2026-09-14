import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useOutsideClick } from "../../features/hooks/useOutsideClick";
import { supabase } from "../../services/supbase";
import BaseButton from "../base/BaseButton";
import { getContacts , deleteContact } from "../../services/contact/contact.api";
import {Contact} from "../../services/contact/contact.type"
import CreateContactForm from "./CreateContactForm"
import ChatItem from "./ChatItem";
import { Modal } from "../base/modal/modal";

function LeftSideBar() {
    const navigate = useNavigate()
    const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
    const [contacts, setContacts] = useState<Contact[]>([])
    // const { session } = useSelector(store => store.user);
    const optionMenuRef = useRef<null>(null)
    const [createContactModalIsOpen, setCreateContactModalIsOpen] = useState(false)

    useEffect(() => {

        getContactsList();
    }, [])
    async function getContactsList() {
        try{
            const res = await getContacts()
            setContacts(res.data)
        } catch (error) {
            console.error("Error fetching contacts:", error);
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

    useOutsideClick(optionMenuRef, () => setShowOptionMenu(false))
    async function handleLogOut() {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            navigate('/login')
        }
    }

    return (
        <div className="relative h-full">
            <div className="bg-gray-900/80 shadow-md relative">
                <div className="flex items-center p-3 gap-x-4">
                    <div ref={optionMenuRef}>
                        <svg onClick={() => setShowOptionMenu(!showOptionMenu)}
                            className="size-10 cursor-pointer text-gray-300 transition-colors duration-300 hover:text-gray-100">
                            <use className="size-10" href="/img/icons.svg#menu"></use>
                        </svg>
                        {
                            showOptionMenu &&
                            <div className="menu-option absolute left-10 top-14 rounded-xl bg-gray-900 p-5">
                                <ul className="list-none">
                                    <li>
                                        <BaseButton emitOnClik={handleLogOut}>logLout</BaseButton>
                                    </li>
                                </ul>
                            </div>

                        }
                    </div>
                    <div className="flex items-center w-full bg-gray-800 rounded-[25px] ">
                        <svg className="size-7 ml-3">
                            <use className="size-7" href="/img/icons.svg#search-rounded"></use>
                        </svg>
                        <input type="text" className="py-3 px-3 outline-none grow" placeholder="Search" />
                    </div>
                </div>
            </div>
            <div className="max-h-[calc(100vh-76px)] overflow-y-auto">
                <ul>
                    {contacts && contacts.map((contact, index) => {
                        return <li key={contact._id}>
                            <ChatItem id={contact._id} name={contact.name} contactId={contact.contact._id} createdAt={contact.createdAt} onDelete={handleDeleteContact} isLast={index=== contacts.length-1} handleRefreshItem={getContactsList} />
                        </li>
                    })}

                </ul>
            </div>
            <button className="btn__action absolute right-5 bottom-5 flex items-center justify-center shadow" onClick={()=> setCreateContactModalIsOpen(true)}
            >
                <svg className="size-5">
                    <use className="size-5" href="/img/icons.svg#user-add"></use>
                </svg>
            </button>

            <Modal
            isOpen={ createContactModalIsOpen }
            onClose={()=> setCreateContactModalIsOpen(false)}
            title="New Contact"
            size="md"
            >
                <CreateContactForm handleClose={()=> setCreateContactModalIsOpen(false)} handleRefreshItems={getContactsList}></CreateContactForm>
            </Modal>
        </div>
    );
}




export default LeftSideBar;