import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useOutsideClick } from "../../features/hooks/useOutsideClick";
import { supabase } from "../../services/supbase";
import BaseButton from "../base/BaseButton";
import ChatAddMenu from "./ChatAddMenu";
import ChatItem from "./ChatItem";

function LeftSideBar() {
    const navigate = useNavigate()
    const [showChatAddMenu, setShowChatAddMenu] = useState<boolean>(false);
    const [showOptionMenu, setShowOptionMenu] = useState<boolean>(false);
    const [chats, setChats] = useState([])
    const { session } = useSelector(store => store.user);
    const optionMenuRef = useRef<null>(null)
    function handleAddItem() {
        setShowChatAddMenu(!showChatAddMenu)
    }
    useEffect(() => {

        getChats()
        return () => {
            // this now gets called when the component unmounts
        };

    }, [])
    async function getChats() {
        const { data, error } = await supabase
            .from('chat')
            .select().eq('user_token', session.access_token)
        if (!error && data) setChats(data)
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
                    {chats && chats.map((chat) => {
                        return <li key={chat.username}>
                            <ChatItem name={chat.name} username={chat.username} created_at={chat.created_at} />
                        </li>
                    })}

                </ul>
            </div>
            <button className="btn__action absolute right-5 bottom-5 flex items-center justify-center shadow" onClick={handleAddItem}
            >
                <svg className="size-5">
                    <use className="size-5" href="/img/icons.svg#user-add"></use>
                </svg>
            </button>
            {showChatAddMenu && createPortal(
                <ChatAddMenu handleCloseModal={handleAddItem} handleRefreshItems={getChats} />,
                document.getElementById("portals")!
            )}
        </div>
    );
}




export default LeftSideBar;