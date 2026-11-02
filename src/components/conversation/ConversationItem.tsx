import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useMediaQuery } from "../../features/media/useMediaQuery";
import { useNavigate } from "react-router";
import { pushTab } from "../../features/tab/tabSlice";
import type { ConversationItem } from "./index.type";

export default function ConversationItem({
  conversationId,
  conversationKey,
  participants,
}: ConversationItem) {
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
  const currentUserId = useAppSelector((state) => state?.user?.id);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [key1, key2] = conversationKey.split(":");
  const contactId = key1 === currentUserId ? key2 : key1;
  const contact = participants.find((p) => p._id === contactId);

  const handleSelectConversation = () => {
    // const conversationId = participantIds.find((p) => p !== currentUserId);
    if (isDesktop) {
      navigate(`/${contactId}`);
    } else {
      navigate(`/${contactId}`);
      dispatch(pushTab("chatroom"));
    }
  };

  return (
    <li onClick={() => handleSelectConversation()} className="cursor-pointer hover:bg-gray-600/40 rounded-md p-2">
      <div className="flex gap-3 grow">
        <div className="size-16 bg-gray-800 rounded-full flex items-center justify-center">
          {/* TODO use a light package for svg */}
          <svg className="size-10">
            <use className="size-810" href="/img/icons.svg#avatar-line"></use>
          </svg>
        </div>
        <div className="flex flex-col gap-y-3 flex-nowrap grow">
          <div className="flex justify-between items-center grow">
            <span className="font-bold">{contact?.name}</span>
            {/* <span className="text-xs pr-2">{toLocale()}</span> */}
          </div>
          {/* <p className="text-sm truncate max-w-60 overflow-hidden">Last seen recently</p> */}
        </div>
      </div>
    </li>
  );
}
