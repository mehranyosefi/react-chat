import { Suspense, lazy } from "react";
import { TabLoaderProps } from "./tabs.type";
import BaseLoading from "../base/BaseLoading";

const ContactList = lazy(() => import("../contact/ContactList"));
const ConversationList = lazy(() => import("../conversation/ConversationList"));
const ChatRoom = lazy(() => import("../chatRoom/ChatRoom"));

function TabLoader({ component }: TabLoaderProps) {
  let Component;

  switch (component) {
    case "ContactList":
      Component = ContactList;
      break;

    case "ConversationList":
      Component = ConversationList;
      break;
    case "ChatRoom":
      Component = ChatRoom;
      break;

    default:
      return null;
  }

  return (
    <Suspense fallback={<BaseLoading />}>
      <Component />
    </Suspense>
  );
}
export default TabLoader;
