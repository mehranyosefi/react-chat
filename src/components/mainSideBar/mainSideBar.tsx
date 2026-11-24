import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useOutsideClick } from "../../features/hooks/useOutsideClick";
// import { logout } from "../../services/auth/auth.api";
import BaseButton from "../base/BaseButton";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { popTab, pushTab } from "../../features/tab/tabSlice";
import Tabs from "../tabs/Tabs";
import CreateContactForm from "../contact/CreateContactForm";
import { BaseModal } from "../base/modal/BaseModal";
import { ApiError } from "../../features/api/apiClient.type";
import { useMediaQuery } from "../../features/media/useMediaQuery";
import { logout } from "../../features/auth/authSlice";
import { useConversations } from "../../features/conversation/useConversation";
import { useContacts } from "../../features/contact/useContacts";
import { CreateContactContext } from "../contact/CreateContactContext";

function MainSideBar() {
  const navigate = useNavigate();
  const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
  // const { session } = useSelector(store => store.user);
  const optionMenuRef = useRef<null>(null);
  const [createContactModalIsOpen, setCreateContactModalIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const activeTabId = useSelector((state: RootState) => state.tab.activeTabId);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isSubTab = activeTabId === "contacts" || activeTabId === "chatroom";
  const { conversations } = useConversations();
  const { contacts } = useContacts();

  useOutsideClick(optionMenuRef, () => setShowOptionMenu(false));
  function handleLogOut() {
    try {
      //TODO handle logout service
      dispatch(logout());
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      navigate("/login");
    } catch (error) {
      const apiError = error as ApiError;
      console.error(apiError.message);
    }
  }
  function handleBackButton(): void {
    dispatch(popTab());
    if (activeTabId === "chatroom") {
      navigate("/");
    }
  }
  const openCreateContact = () => {
    setCreateContactModalIsOpen(true);
  }


  return (
    <div className="relative h-full">
      <div className="relative">
        <div className="flex items-center p-3 gap-x-4">
          {isSubTab ? (
            <BaseButton
              emitOnClick={handleBackButton}
              className="size-10 flex items-center justify-center text-gray-300 transition-colors duration-300 hover:bg-gray-600/40"
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
          {activeTabId !== "chatroom" && (
            <div className="flex items-center w-[calc(100%-56px)] bg-gray-700/50 rounded-3xl">
              <svg className="size-7 ml-3">
                <use className="size-7" href="/img/icons.svg#search-rounded"></use>
              </svg>
              <input type="text" className="py-3 px-3 outline-none grow" placeholder="Search" />
            </div>
          )}
        </div>
      </div>
      {/* <Tabs /> */}
      <div className="grow overflow-hidden h-full">
         <CreateContactContext.Provider value={openCreateContact}>
          <Tabs />
        </CreateContactContext.Provider>
      </div>
      {activeTabId !== "chatroom" &&
        ((activeTabId === "conversations" && conversations.length != 0) ||
          (activeTabId === "contacts" && contacts.length != 0)) && (
          <BaseButton
            className="btn__action absolute right-5 bottom-5 flex items-center justify-center shadow"
            paddingX="0"
            paddingY="0"
            variant="main"
            rounded="rounded-full"
            emitOnClick={() => {
              if (activeTabId === "conversations") {
                dispatch(pushTab("contacts"));
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
          </BaseButton>
        )}

      <BaseModal
        isOpen={createContactModalIsOpen}
        onClose={() => setCreateContactModalIsOpen(false)}
        title="New Contact"
        size="md"
      >
        <CreateContactForm
          handleClose={() => setCreateContactModalIsOpen(false)}
        ></CreateContactForm>
      </BaseModal>
    </div>
  );
}

export default MainSideBar;
