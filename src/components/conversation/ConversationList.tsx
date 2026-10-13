import { useConversations } from "../../features/conversation/useConversation";
import { useEffect } from "react";

function ConversationList() {
  const { conversations, loading, error,status, getConversations } = useConversations();

  useEffect(() => {
    if (status === "idle") {
      getConversations();
    }
  }, [status, getConversations]);


  return(
    <div>
      {loading && <div className="flex justify-center py-5">Loading...</div>}
      {error && <div>{error}</div>}
      <ul>
        {conversations && conversations.map((conversation)=>{
        return(
          <li key={conversation._id}>
            {conversation._id}
          </li>
        )
      })}
      </ul>
    </div>
  ) 
}

export default ConversationList;
