import { Link } from "react-router";
import { ContactProps } from "../../types/components";
import BaseButton from "../base/BaseButton";
import { useState, useRef } from "react";
import { useOutsideClick } from "../../features/hooks/useOutsideClick";
import { Modal } from "../base/modal/modal";
import EditContactForm from "../leftSideBar/EditContactForm"
export default function ContactItem(props: ContactProps) {
  const { id, name, contactId, createdAt, onDelete, isLast , handleRefreshItem } = props;
  const [showMenu, setShowMenu] = useState(false);
  const [editContactModalIsOpen, setEditContactModalIsOpen] = useState(false)
  const menuRef = useRef(null);
  useOutsideClick(menuRef, () => setShowMenu(false));

  function toLocale() {
    return new Date(createdAt).toLocaleDateString("fa-IR");
  }
  return (
    <>
    <div className="flex items-center hover:bg-gray-600/40 rounded-md p-2">
      <Link to={contactId} className="flex gap-3 grow">
        <div className="size-16 bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="size-10">
            <use className="size-810" href="/img/icons.svg#avatar-line"></use>
          </svg>
        </div>
        <div className="flex flex-col gap-y-3 flex-nowrap grow">
          <div className="flex justify-between items-center grow">
            <span className="font-bold">{name}</span>
            <span className="text-xs pr-2">{toLocale()}</span>
          </div>
          <p className="text-sm truncate max-w-60 overflow-hidden">
            Lorem ipsum dolor sit amet sfesefgfegdddsss
          </p>
        </div>
      </Link>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="px-2 py-1 text-gray-400 hover:text-white text-xl"
        >
          ⋮
        </button>
        {showMenu && (
          <div
            className={`absolute right-0 w-32 rounded-xl bg-gray-800 shadow-lg p-2 ${isLast ? "bottom-10" : "top-10 z-50"}`}
          >
            <BaseButton
              variant="none"
              paddingX="px-3"
              paddingY="py-2"
              className="w-full hover:bg-gray-700 mb-2"
              emitOnClick={()=>{
                setShowMenu(false);
                setEditContactModalIsOpen(true)
              }}
            >
              Edit
            </BaseButton>
            <BaseButton
              variant="danger"
              paddingX="px-3"
              paddingY="py-2"
              className="w-full "
              emitOnClick={() => onDelete(id)}
            >
              Delete
            </BaseButton>
          </div>
        )}
      </div>
    </div>
    <Modal
      isOpen={editContactModalIsOpen}
      onClose={() => setEditContactModalIsOpen(false)}
      title="Edit Contact"
      size="sm"
    >
      <EditContactForm
        id={id}
        currentName={name}
        handleClose={() => setEditContactModalIsOpen(false)}
        handleRefreshItems={handleRefreshItem}
      />
    </Modal>
    </>
  );
}

