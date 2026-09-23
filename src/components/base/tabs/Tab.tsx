import { useRef, useEffect } from "react";
import { TabProps } from "./tabs.type";
import TabLoader from "./TabLoader";
import Tabs from "./Tabs";

function Tab({ tabs, activeTabId }: TabProps) {
  const previousTabId = useRef(activeTabId);
  const hasTabChanged = previousTabId.current !== activeTabId;
  const currentTab = tabs.find((tab) => tab.id === activeTabId);
  const previousTab = tabs.find((tab) => tab.id === previousTabId.current);

  const direction =
    (currentTab?.index ?? 0) > (previousTab?.index ?? 0)
      ? "forward"
      : "backward";

  useEffect(() => {
    previousTabId.current = activeTabId;
  }, [activeTabId]);

  if (!currentTab) return null;

  const className = hasTabChanged
    ? direction === "forward"
      ? "animation-slide-left"
      : "animation-slide-right"
    : "";

  return (
    <div className={className}>
      {currentTab.children && currentTab.children.length > 0 ? (
        <Tabs tabs={currentTab.children} />
      ) : (
        <TabLoader component={currentTab.component} props={currentTab.props} />
      )}
    </div>
  );
}

export default Tab;
