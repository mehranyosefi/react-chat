import { TabProps } from "./tabs.type";
import { useEffect, useState } from "react";
import Tab from "./Tab";

function Tabs({ tabs, activeTabId: initialActiveTabId }: TabProps) {
  const [activeTabId, setActiveTabId] = useState(
    initialActiveTabId ?? tabs[0]?.id,
  );

  useEffect(() => {
    if (initialActiveTabId) {
      setActiveTabId(initialActiveTabId);
    }
  }, [initialActiveTabId]);

  return (
    <div className="h-full overflow-hidden">
      <Tab tabs={tabs} activeTabId={activeTabId} />
    </div>
  );
}

export default Tabs;
