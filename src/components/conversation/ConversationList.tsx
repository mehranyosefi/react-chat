import { Link } from "react-router";
import { useConversations } from "../../features/conversation/useConversation";
import { useEffect } from "react";

function ConversationList() {
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
              <li key={conversation._id}>
                <Link to={conversation.participants[1]} className="flex gap-3 grow">
                  <div className="size-16 bg-gray-800 rounded-full flex items-center justify-center">
                    {/* TODO use a light package for svg */}
                    <svg className="size-10">
                      <use className="size-810" href="/img/icons.svg#avatar-line"></use>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-y-3 flex-nowrap grow">
                    <div className="flex justify-between items-center grow">
                      <span className="font-bold">{conversation._id}</span>
                      {/* <span className="text-xs pr-2">{toLocale()}</span> */}
                    </div>
                    {/* <p className="text-sm truncate max-w-60 overflow-hidden">Last seen recently</p> */}
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default ConversationList;
