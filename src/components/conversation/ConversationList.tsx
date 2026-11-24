import { useConversations } from "../../features/conversation/useConversation";
import { useEffect } from "react";
import ConversationItem from "./ConversationItem";
import { getAccessToken } from "../../utility/auth/tokenStorage";
import ConversationEmptyState from "./ConversationEmptyState";

export default function ConversationList() {
  const { conversations, loading, error, status, getConversations } = useConversations();

  useEffect(() => {
    if (!getAccessToken()) return;

    if (status === "idle") {
      getConversations();
    }
  }, [status, getConversations]);

  return (
    <div className="h-full">
      {loading && <div className="flex justify-center py-5">Loading...</div>}
      {error && <div>{error}</div>}
      {conversations.length ? (
        <ul>
          {conversations.map((conversation) => {
            return (
              <ConversationItem
                key={conversation._id}
                conversationId={conversation._id}
                conversationKey={conversation.conversationKey}
                participants={conversation.participants}
              />
            );
          })}
        </ul>
      ) : (
        <ConversationEmptyState />
      )}
    </div>
  );
}
