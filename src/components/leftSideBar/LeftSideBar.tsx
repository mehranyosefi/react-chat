import { useRef, useState, lazy } from "react";
import { useNavigate } from "react-router";
import { useOutsideClick } from "../../features/hooks/useOutsideClick";
import { supabase } from "../../services/supbase";
import BaseButton from "../base/BaseButton";
import { useContacts } from "../../features/hooks/useContacts";
import Tabs from "../tabs/Tabs";
import CreateContactForm from "./CreateContactForm";
import { BaseModal } from "../base/modal/BaseModal";
const ContactList = lazy(() => import("./ContactList"));
const ConversationList = lazy(() => import("./ConversationList"));

function LeftSideBar() {
  const navigate = useNavigate();
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
  // const { session } = useSelector(store => store.user);
  const optionMenuRef = useRef<null>(null);
  const [createContactModalIsOpen, setCreateContactModalIsOpen] =
    useState(false);
  const { contacts, loading, refresh, deleteContact } = useContacts();
  const [activeTabId, setActiveTabId] = useState<string>("conversations");

  const tabs = [
    {
      id: "conversations",
      component: ConversationList,
      index: 0,
    },
    {
      id: "contacts",
      component: ContactList,
      props: {
        contacts,
        loading,
        onDelete: deleteContact,
        handleRefreshItem: refresh,
      },
      index: 1,
    },
  ];

  useOutsideClick(optionMenuRef, () => setShowOptionMenu(false));
  async function handleLogOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    }
  }

  return (
    <div className="relative h-full">
      <div className="relative">
        <div className="flex items-center p-3 gap-x-4">
          {activeTabId === "contacts" ? (
            <BaseButton
              emitOnClick={() => setActiveTabId("conversations")}
              className="size-10 flex items-center justify-center text-gray-300 transition-colors duration-300 hover:bg-gray-500"
              paddingX="0"
              paddingY="0"
              variant="none"
              rounded="rounded-full"
            >
              <svg className="size-6">
                <use href="/img/icons.svg#arrow-back"></use>
              </svg>
            </BaseButton>
          ) : (
            <div ref={optionMenuRef}>
              <svg
                onClick={() => setShowOptionMenu(!showOptionMenu)}
                className="size-10 cursor-pointer text-gray-300 transition-colors duration-300 hover:text-gray-100"
              >
                <use className="size-10" href="/img/icons.svg#menu"></use>
              </svg>
              {showOptionMenu && (
                <div className="menu-option absolute left-10 top-14 rounded-xl bg-gray-900 p-5">
                  <ul className="list-none">
                    <li>
                      <BaseButton emitOnClick={handleLogOut}>logLout</BaseButton>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center w-[calc(100%-56px)] bg-gray-700/50 rounded-3xl">
            <svg className="size-7 ml-3">
              <use
                className="size-7"
                href="/img/icons.svg#search-rounded"
              ></use>
            </svg>
            <input
              type="text"
              className="py-3 px-3 outline-none grow"
              placeholder="Search"
            />
          </div>
        </div>
      </div>
      <Tabs tabs={tabs} activeTabId={activeTabId} />
      <button
        className="btn__action absolute right-5 bottom-5 flex items-center justify-center shadow"
        onClick={() => {
          if (activeTabId === "conversations") {
            setActiveTabId("contacts");
          } else if (activeTabId === "contacts") {
            setCreateContactModalIsOpen(true);
          }
        }}
      >
        {activeTabId === "conversations" ? (
          <svg className="size-5">
            <use href="/img/icons.svg#user-add"></use>
          </svg>
        ) : (
          <span className="text-3xl">+</span>
        )}
      </button>

      <BaseModal
        isOpen={createContactModalIsOpen}
        onClose={() => setCreateContactModalIsOpen(false)}
        title="New Contact"
        size="md"
      >
        <CreateContactForm
          handleClose={() => setCreateContactModalIsOpen(false)}
          handleRefreshItems={refresh}
        ></CreateContactForm>
      </BaseModal>
    </div>
  );
}

export default LeftSideBar;
