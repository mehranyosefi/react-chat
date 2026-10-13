import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../../services/supbase";
import { MessageType } from "../../types/components";
import TextInputModel from "./TextInputModel";
import { getContactById } from "../../services/contact/contact.api";
import { Contact } from "../../services/contact/contact.type";
import { Conversation } from "../../services/conversation/conversation.type";
import { getConversationById, getConversations } from "../../services/conversation/conversation.api";

function ChatRoom() {
    const [contact, setContact] = useState<Contact>()
    const [conversation, setConversation] = useState<Conversation>()
    const [messages, updateMessages] = useState<Array<MessageType>>([]);
    const { userId, conversationId } = useParams()
    // const { email } = useSelector((store) => store.user)

    // useEffect(() => {
    //     Promise.all([
    //         fetchChat(),
    //         fetchMessages()
    //     ])
    //     const messageListener = supabase
    //         .channel(userId!.toString())
    //         .on(
    //             "postgres_changes",
    //             { event: "INSERT", schema: "public", table: "message" },
    //             (payload) => {
    //                 console.log("Change received!", payload);
    //             }
    //         )
    //         .subscribe();

    //     return () => messageListener.unsubscribe();
    // }, [userId])
    
    //fetch contact
    useEffect(()=> {
        const controller = new AbortController()
        const loadData = async() => {
            const { data } = await getContactById(userId!, { signal: controller.signal })
            setContact(data)
        }
        if(userId) loadData()

        return ()=>{
            controller.abort()
        }

    }, [userId])

    //fetch conversation
    useEffect(()=> {
        const controller = new AbortController()
        const loadData = async() => {
            const { data } = await getConversationById(conversationId!, { signal: controller.signal })
            setConversation(data)
        }
        if(conversationId) loadData()

        return ()=>{
            controller.abort()
        }
    }, [conversationId])

    
    async function fetchMessages() {
        const { data: messageData, error: errorData } = await supabase
            .from('message')
            .select()
            .eq('chat_userId', userId)
        console.log(messageData)
        updateMessages(messageData)
    }
    async function handleSendMessage(input: string) {
        debugger
        //check if conversation exists, if not create one
        if(!conversation?._id) {
            createConversation()
        }

        //set message with conversation id and user id on ws
        

    }

    function sendMessage(input: string) {

    }
    
    function createConversation() {

    }


    return (
        <div className="flex flex-col justify-between h-full md:px-24">
            <div className="flex items-center justify-between px-5 py-2 rounded-4xl bg-gray-800">
                <div className="flex gap-x-4">
                    <img className="size-12 rounded-full" src="" alt="" />
                    <div className="flex flex-col gap-y-2">
                        <span>{contact?.name}</span>
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
            <div className="mx-auto w-full">
                <TextInputModel classes="w-full py-2" emitValue={handleSendMessage}></TextInputModel>
            </div>
        </div>
    );
}

export default ChatRoom;