import { Suspense, lazy } from "react";
import { TabLoaderProps } from "./tabs.type";
import Loader from "../base/Loader";

const ContactList = lazy(() => import("../leftSideBar/ContactList"));
const ConversationList = lazy(() => import("../leftSideBar/ConversationList"));

function TabLoader({ component }: TabLoaderProps) {
  let Component;

  switch (component) {
    case "ContactList":
      Component = ContactList;
      break;

    case "ConversationList":
      Component = ConversationList;
      break;

    default:
      return null;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
}
export default TabLoader;
