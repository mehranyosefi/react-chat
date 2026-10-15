import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Conversation } from "../../services/conversation/conversation.type";
import {
  createConversation,
  getConversationBycontactId,
} from "../../services/conversation/conversation.api";
import { useMessage } from "../../features/message/useMessage";
import TextInputModel from "./TextInputModel";
import { getUserByID } from "../../services/user/user.api";
import { User } from "../../services/user/user.type";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../../store";
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function ChatRoom() {
  const { contactId } = useParams();
  const [contact, setContact] = useState<User>();
  const [conversation, setConversation] = useState<Conversation>();

  // Get current logged-in user (from your Redux auth state)
  const currentUserId = useAppSelector((state) => state?.user?.email);

  // 1. Pass conversation?._id and currentUserId directly to the hook
  const {
    messages,
    loading: isMessagesLoading, // 'loading' is boolean (fetchStatus === "loading")
    fetchError: messagesError,
    getMessages,
    sendMessage,
    isSending,
  } = useMessage(conversation?._id, currentUserId);

  // 2. Fetch or load conversation
  useEffect(() => {
    let isMounted = true;

    const handleFetchData = async () => {
      try {
        const { data } = await getConversationBycontactId(contactId!);
        if (isMounted) setConversation(data);
      } catch (err) {
        console.error("Failed to load conversation", err);
      }
    };

    if (contactId) {
      handleFetchData();
    }

    return () => {
      isMounted = false; // clean flag, do NOT call handleFetchData here!
    };
  }, [contactId]);

  // 3. Fetch contact profile
  useEffect(() => {
    let isMounted = true;
    const fetchContact = async () => {
      try {
        if (contactId) {
          const { data } = await getUserByID(contactId);
          if (isMounted) setContact(data?.user);
        }
      } catch (err) {
        console.error("Failed to load contact", err);
      }
    };
    fetchContact();

    return () => {
      isMounted = false;
    };
  }, [contactId]);

  // 4. Fetch messages once conversation is loaded
  useEffect(() => {
    if (conversation?._id) {
      getMessages(false, conversation._id);
    }
  }, [conversation?._id, getMessages]);

  // 5. Send message
  async function handleSendMessage(input: string) {
    if (!input.trim() || isSending) return;

    try {
      let currentConvId = conversation?._id;

      // Lazy fallback if conversation didn't exist yet
      if (!currentConvId && contactId) {
        const { data } = await createConversation(contactId);
        setConversation(data);
        currentConvId = data._id;
      }

      if (currentConvId && currentUserId) {
        await sendMessage(input, {
          conversationId: currentConvId,
          currentUserId,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <div className="flex flex-col justify-between h-full md:px-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-2 rounded-4xl bg-gray-800 text-white">
        <div className="flex gap-x-4 items-center">
          <div className="size-12 rounded-full bg-gray-600 flex items-center justify-center font-bold">
            {contact?.name?.[0] ?? "U"}
          </div>
          <div className="flex flex-col gap-y-1">
            <span className="font-semibold">{contact?.name ?? "Loading..."}</span>
            <span className="text-xs text-gray-400">Online</span>
          </div>
        </div>

        <div className="flex gap-x-4">
          <svg className="size-7 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer">
            <use href="/img/icons.svg#search-rounded"></use>
          </svg>
        </div>
      </div>

      {/* Messages Area */}
      <div className="grow overflow-y-auto py-4 flex flex-col gap-y-2">
        {isMessagesLoading && messages.length === 0 && (
          <div className="text-center text-gray-400 py-4">Loading messages...</div>
        )}

        {messagesError && <div className="text-center text-red-500 py-2">{messagesError}</div>}

        {!isMessagesLoading && messages.length === 0 && (
          <div className="text-center text-gray-400 m-auto">
            No messages yet. Send a message to start!
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((message) => {
          // Identify sender: can be an ID string or an object depending on backend populate
          const senderId =
            typeof message.sender === "object" ? message.sender?._id : message.sender;
          const isMe = senderId === currentUserId || message.sender !== contactId;

          return (
            <div
              key={message._id || message.userId}
              className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                isMe
                  ? "self-end bg-blue-600 text-white rounded-br-none"
                  : "self-start bg-gray-700 text-white rounded-bl-none"
              } ${message.pending ? "opacity-60" : "opacity-100"}`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-[10px] text-gray-300 block text-right mt-1">
                {message.createdAt
                  ? new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "sending..."}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input Field */}
      <div className="mx-auto w-full pb-4">
        <TextInputModel classes="w-full py-2" emitValue={handleSendMessage} />
      </div>
    </div>
  );
}

export default ChatRoom;
