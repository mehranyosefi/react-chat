import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../../services/supbase";
import { MessageType } from "../../types/components";
import TextInputModel from "./TextInputModel";

function ChatRoom() {
    const [chatInfo, setChatInfo] = useState()
    const [messages, updateMessages] = useState<Array<MessageType>>([]);
    const { username } = useParams()
    // const { email } = useSelector((store) => store.user)

    // useEffect(() => {
    //     Promise.all([
    //         fetchChat(),
    //         fetchMessages()
    //     ])
    //     const messageListener = supabase
    //         .channel(username!.toString())
    //         .on(
    //             "postgres_changes",
    //             { event: "INSERT", schema: "public", table: "message" },
    //             (payload) => {
    //                 console.log("Change received!", payload);
    //             }
    //         )
    //         .subscribe();

    //     return () => messageListener.unsubscribe();
    // }, [username])

    async function fetchChat() {
        const { data, error } = await supabase
            .from('chat')
            .select()
            .eq('username', username).limit(1)
            .single()
        if (!error && data) setChatInfo(data)
    }
    async function fetchMessages() {
        const { data: messageData, error: errorData } = await supabase
            .from('message')
            .select()
            .eq('chat_username', username)
        console.log(messageData)
        updateMessages(messageData)
    }
    async function handleSendMessage(val: string) {
        const { data, error } = await supabase
            .from('message')
            .insert({ content: val, chat_username: username })

    }
    return (
        <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900/80 shadow-md">
                <div className="flex gap-x-4">
                    <img className="size-12 rounded-full" src="" alt="" />
                    <div className="flex flex-col gap-y-2">
                        <span>{chatInfo?.name}</span>
                        <span className="text-xs">state</span>
                    </div>
                </div>
                <div className="flex gap-x-4">
                    <svg className="size-7 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer">
                        <use className="size-7" href="/img/icons.svg#search-rounded"></use>
                    </svg>
                    <svg className="size-7 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer">
                        <use className="size-7" href="/img/icons.svg#outline-call"></use>
                    </svg>
                    <svg className="size-7 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer">
                        <use className="size-7" href="/img/icons.svg#options-vertical"></use>
                    </svg>
                </div>
            </div>
            <div className="grow">
                {messages && messages.map((message) => {
                    return <div key={message.id}>{message.content}</div>
                })}
            </div>
            <div className="mx-auto">
                <TextInputModel classes="w-[30rem]" emitValue={handleSendMessage}></TextInputModel>
            </div>
        </div>
    );
}

export default ChatRoom;