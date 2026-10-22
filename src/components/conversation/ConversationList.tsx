import { useNavigate } from "react-router";
import { useConversations } from "../../features/conversation/useConversation";
import { useEffect } from "react";
import { useMediaQuery } from "../../features/media/useMediaQuery";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { pushTab } from "../../features/tab/tabSlice";
import { RootState } from "../../store";

function ConversationList() {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { conversations, loading, error, status, getConversations } = useConversations();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserId = useAppSelector((state) => state?.user?.id);

  useEffect(() => {
    if (status === "idle") {
      getConversations();
    }
  }, [status, getConversations]);

  const handleSelectConversation = (participantIds: string[]) => {
    const participantId = participantIds.find((p) => p !== currentUserId);
    if (isDesktop) {
      navigate(`/${participantId}`);
    } else {
      navigate(`/${participantId}`);
      dispatch(pushTab("chatroom"));
    }
  };

  return (
    <div>
      {loading && <div className="flex justify-center py-5">Loading...</div>}
      {error && <div>{error}</div>}
      <ul>
        {conversations &&
          conversations.map((conversation) => {
            return (
              <li
                key={conversation._id}
                onClick={() => handleSelectConversation(conversation.participants)}
                className="cursor-pointer"
              >
                <div className="flex gap-3 grow">
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
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default ConversationList;
