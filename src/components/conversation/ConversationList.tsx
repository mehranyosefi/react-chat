import { useConversations } from "../../features/conversation/useConversation";
import { useEffect } from "react";
import ConversationItem from "./ConversationItem";

export default function ConversationList() {
  const { conversations, loading, error, status, getConversations } = useConversations();

  useEffect(() => {
    if (status === "idle") {
      getConversations();
    }
  }, [status, getConversations]);


  return (
    <div>
      {loading && <div className="flex justify-center py-5">Loading...</div>}
      {error && <div>{error}</div>}
      <ul>
        {conversations &&
          conversations.map((conversation) => {
            return (
              <ConversationItem
                key={conversation._id}
                conversationId={conversation._id}
                conversationKey={conversation.conversationKey}
              />
            );
          })}
      </ul>
    </div>
  );
}
