import { TabProps } from "./tabs.type";
import TabLoader from "./TabLoader";

function Tab({ tabs, activeTabId, animation }: TabProps) {
  const currentTab = tabs.find((tab) => tab.id === activeTabId);
  if (!currentTab) return null;

  const animationClass =
    currentTab.animation ??
    (animation === "forward"
      ? "animation-slide-left"
      : "animation-slide-right");

  return (
    <div className={animationClass}>
      <TabLoader component={currentTab.component} />
    </div>
  );
}

export default Tab;
