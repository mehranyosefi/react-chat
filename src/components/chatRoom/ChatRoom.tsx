import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Conversation } from "../../services/conversation/conversation.type";
import {
  createConversation,
  getConversationBycontactId,
} from "../../services/conversation/conversation.api";
import { useMessage } from "../../features/message/useMessage";
import TextInputModel from "./TextInputModel";
import { getUserByID } from "../../services/user/user.api";
import { User } from "../../services/user/user.type";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useConversations } from "../../features/conversation/useConversation";
import BaseButton from "../base/BaseButton";
import { popTab } from "../../features/tab/tabSlice";

function ChatRoom() {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { contactId } = useParams();
  const [contact, setContact] = useState<User>();
  const [conversation, setConversation] = useState<Conversation>();
  const currentUserId = useAppSelector((state) => state?.user?.id);
  const { joinToConversation, leaveConversation } = useConversations();
  const isSocketConnected = useAppSelector((state) => state.socket.connected);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const activeTabId = useSelector((state: RootState) => state.tab.activeTabId);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const initialScrollConversationIdRef = useRef<string | null>(null);
  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);
  const {
    messages,
    loading: isMessagesLoading,
    fetchStatus,
    fetchError: messagesError,
    getMessages,
    getOlderMessages,
    hasMore,
    olderMessagesStatus,
    sendMessage,
  } = useMessage(conversation?._id, currentUserId);
  const prevMessagesLengthRef = useRef(messages.length);
  const pendingOlderScrollRef = useRef<{
    scrollHeight: number;
    scrollTop: number;
    oldestMessageId: string;
  } | null>(null);
  const shouldScrollToBottomRef = useRef(false);
  const prevLastMessageIdRef = useRef<string | undefined>(
    messages[messages.length - 1]?._id
  );
  //TODO return to '/' path if contact or conversation doesnt exist

  //Fetch conversation and join to that
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
      isMounted = false;
    };
  }, [contactId]);

  //Join to conversation
  useEffect(() => {
    const conversationId = conversation?._id;
    if (!isSocketConnected || !conversationId) {
      return;
    }

    // Join room
    joinToConversation(conversation._id);

    return () => {
      leaveConversation(conversationId);
    };
  }, [isSocketConnected, conversation?._id, joinToConversation, leaveConversation]);

  //Fetch contact profile - the contact actucally is as user in system
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

  //Fetch messages once conversation is loaded
  useEffect(() => {
    if (conversation?._id) {
      getMessages(false, conversation._id, 20);
    }
  }, [conversation?._id, getMessages]);

  // Initial scroll to bottom when messages are first loaded for a conversation
  useLayoutEffect(() => {
    const container = messageContainerRef.current;
    const conversationId = conversation?._id;

    if (!container || !conversationId || isMessagesLoading) return;
    if (fetchStatus !== "succeeded") return;
    if (initialScrollConversationIdRef.current === conversationId) return;

    container.scrollTop = container.scrollHeight;
    initialScrollConversationIdRef.current = conversationId;
  }, [conversation?._id, isMessagesLoading, fetchStatus]);

  // Handle scroll position preservation when older messages are prepended
  useLayoutEffect(() => {
    const container = messageContainerRef.current;
    const pending = pendingOlderScrollRef.current;

    if (!container || !pending) return;

    const heightDifference = container.scrollHeight - pending.scrollHeight;

    container.scrollTop = pending.scrollTop + heightDifference;

    // Important: older messages are not new messages.
    // Prevent the next effect from scrolling to the bottom.
    prevMessagesLengthRef.current = messages.length;

    pendingOlderScrollRef.current = null;
  }, [messages]);

  // Handle user sending a message OR incoming messages

  useLayoutEffect(() => {
  const container = messageContainerRef.current;
  if (!container) return;

  const lastMessage = messages[messages.length - 1];
  const previousLastId = prevLastMessageIdRef.current;

  prevLastMessageIdRef.current = lastMessage?._id;

  // If the last message hasn't changed, this was likely
  // a prepend of older messages, not a new message.
  if (!lastMessage || lastMessage._id === previousLastId) {
    return;
  }

  const distanceFromBottom =
    container.scrollHeight -
    container.scrollTop -
    container.clientHeight;

  const isNearBottom = distanceFromBottom < 150;
  const isMyMessage = lastMessage.sender === currentUserId;

  if (
    shouldScrollToBottomRef.current ||
    isMyMessage ||
    isNearBottom
  ) {
    scrollToBottom(
      shouldScrollToBottomRef.current ? "smooth" : "auto"
    );
    shouldScrollToBottomRef.current = false;
  } else {
    setShowScrollBottomButton(true);
  }
}, [messages, currentUserId]);

  // Scroll handler for pagination (fetching older messages when scrolled to top)
  const handleMessagesScroll = () => {
    const container = messageContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    // Show button if scrolled up more than 150px from the bottom
    setShowScrollBottomButton(distanceFromBottom > 750);

    // 1. Check for fetching older messages when at the top
    if (
      container.scrollTop < 50 &&
      hasMore &&
      olderMessagesStatus !== "loading" &&
      pendingOlderScrollRef.current === null
    ) {
      const oldestMessage = messages[0];
      if (!oldestMessage) return;

      pendingOlderScrollRef.current = {
        scrollHeight: container.scrollHeight,
        scrollTop: container.scrollTop,
        oldestMessageId: oldestMessage._id,
      };

      getOlderMessages(oldestMessage._id);
    }
  };

  //Send message
  async function handleSendMessage(input: string) {
    if (!input.trim()) return;

    shouldScrollToBottomRef.current = true;

    try {
      // check if conversation exist
      if (!conversation?._id) {
        const { data } = await createConversation(contactId!);
        setConversation(data);
        //Jonin to conversation with ws
        joinToConversation(data._id);
      }
      sendMessage(input, {
        conversationId: conversation?._id,
        currentUserId: currentUserId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  function handleBackButton(): void {
    dispatch(popTab());
    if (activeTabId === "chatroom") {
      navigate("/");
    }
  }
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = messageContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
    setShowScrollBottomButton(false);
  };

  return (
    <div className="flex flex-col justify-between h-full p-5 md:px-24 relative">
      {/* Top Bar */}
      <div className="flex items-center gap-x-2">
        <BaseButton
          className="md:hidden size-10 flex items-center justify-center text-gray-300 transition-colors duration-300 hover:bg-gray-600/40"
          paddingX="0"
          paddingY="0"
          variant="none"
          rounded="rounded-full"
          emitOnClick={handleBackButton}
        >
          <svg className="size-6">
            <use href="/img/icons.svg#arrow-back"></use>
          </svg>
        </BaseButton>
        <div className="flex items-center justify-between grow px-5 py-2 rounded-4xl bg-gray-800 text-white">
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
      </div>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Messages Area */}
        <div
          ref={messageContainerRef}
          onScroll={handleMessagesScroll}
          className="grow min-h-0 overflow-y-auto py-4 flex flex-col gap-y-2 px-5"
        >
          {/* <div className="mt-auto" /> */}

          {isMessagesLoading && messages.length === 0 && (
            <div className="text-center text-gray-400 py-4">Loading messages...</div>
          )}

          {olderMessagesStatus === "loading" && (
            <div className="text-center text-gray-400 py-2">Loading older messages...</div>
          )}

          {messagesError && <div className="text-center text-red-500 py-2">{messagesError}</div>}

          {!isMessagesLoading && messages.length === 0 && (
            <div className="text-center text-gray-400 m-auto">
              No messages yet. Send a message to start!
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((message) => {
            const isMe = message.sender === currentUserId;
            return (
              <div
                key={message._id}
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

        {/* Scroll to Bottom */}
        {showScrollBottomButton && (
          <button
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-44 right-12 md:right-32 z-10 size-12 md:size-14 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 opacity-75 cursor-pointer"
            title="Scroll to bottom"
          >
            <svg className="size-5 -rotate-90">
              <use href="/img/icons.svg#arrow-back"></use>
            </svg>
          </button>
        )}
        {/* Input Field */}
        <div className="mx-auto w-full pb-4">
          <TextInputModel classes="w-full py-2" emitValue={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
