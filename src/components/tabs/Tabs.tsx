import Tab from "./Tab";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

function Tabs() {
  const { tabs, activeTabId, animation } = useSelector(
    (state: RootState) => state.tab,
  );

  return (
    <div className="h-full overflow-hidden">
      <Tab tabs={tabs} activeTabId={activeTabId} animation={animation} />
    </div>
  );
}

export default Tabs;
