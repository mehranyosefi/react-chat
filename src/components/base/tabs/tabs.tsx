import { ReactNode, useRef, useEffect } from "react";

type TabsItem = {
  id: string;
  component: ReactNode;
  index: number;
};

type TabsProps = {
  tabs: TabsItem[];
  activeTabId: string;
};

function Tabs({ tabs, activeTabId }: TabsProps) {
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

  return (
    <div className="h-full overflow-hidden">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <div
            key={tab.id}
            className={
              isActive
                ? hasTabChanged
                  ? direction === "forward"
                    ? "animation-slide-left"
                    : "animation-slide-right"
                  : ""
                : "hidden"
            }
          >
            {tab.component}
          </div>
        );
      })}
    </div>
  );
}

export default Tabs;
