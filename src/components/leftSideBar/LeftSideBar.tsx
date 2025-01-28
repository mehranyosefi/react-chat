import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

function LeftSideBar() {
    const [showChatAddMenu, setShowChatAddMenu] = useState<boolean>(false)
    function handleAddItem() {
        setShowChatAddMenu(!showChatAddMenu)
    }

    return (
        <div className="relative h-full">
            <div className="bg-gray-900/80 shadow-md">
                <div className="flex items-center p-3 gap-x-4">
                    <svg className="size-10 cursor-pointer text-gray-300 transition-colors duration-300 hover:text-gray-100">
                        <use className="size-10" href="/img/icons.svg#menu"></use>
                    </svg>

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
                    <li>
                        <Item />
                    </li>

                </ul>
            </div>
            <button className="btn__action absolute right-5 bottom-5 flex items-center justify-center shadow" onClick={handleAddItem}
            >
                <svg className="size-5">
                    <use className="size-5" href="/img/icons.svg#user-add"></use>
                </svg>
            </button>
            {showChatAddMenu && createPortal(
                <ChatAddMenu handleCloseModal={handleAddItem} />,
                document.getElementById("portals")!
            )}
        </div>
    );
}

export default LeftSideBar;

function Item() {
    return (
        <Link to="/" className="flex transition-colors 50 hover:bg-gray-600/40 gap-3 rounded-md p-2">
            <div className="size-16 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="size-10">
                    <use className="size-810" href="/img/icons.svg#avatar-line"></use>
                </svg>
            </div>
            <div className="flex flex-col gap-y-3 flex-nowrap grow">
                <div className="flex justify-between items-center grow">
                    <span className="font-bold">username</span>
                    <span className="text-xs pr-2">19:42</span>
                </div>
                <p className="text-sm truncate max-w-60 overflow-hidden">Lorem ipsum dolor sit amet sfesefgfegdddsss</p>
            </div>
        </Link>
    )
}

function ChatAddMenu(props: { handleCloseModal: () => void }) {
    const { handleCloseModal } = props
    return (
        <div className="modal">
            <div className="modal__container h-screen w-full flex items-center justify-center">
                <div className="w-[25rem] rounded-xl bg-gray-900/80 p-5">
                    <div className="modal__header">
                        <span className="text-xl">New Contact</span>
                    </div>
                    <div className="modal__body flex flex-col gap-y-5 mt-5">
                        <div className="flex gap-x-2">
                            <label>name:</label>
                            <input className="ml-2 p-2 outline outline-gray-400 rounded-xl placeholder:text-xs" type="text" name="name" placeholder="name" />
                        </div>
                        <div className="flex gap-x-2">
                            <label>username:</label>
                            <input className="ml-2 p-2 outline outline-gray-400 rounded-xl placeholder:text-xs" type="text" name="username" placeholder="username" />
                        </div>
                    </div>
                    <div className="modal__footer flex gap-x-5 mt-5">
                        <button className="cursor-pointer">DONE</button>
                        <button className="cursor-pointer" onClick={handleCloseModal}>CANCEL</button>
                    </div>
                </div>
            </div>
        </div>
    )
}