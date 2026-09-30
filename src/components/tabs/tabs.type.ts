export type TabAnimation = "forward" | "backward"

export type TabItem = {
  id: string;
  component: string;
  props?: Record<string, unknown>;
  animation?:string
};

export type TabProps = {
  tabs: TabItem[];
  activeTabId?: string;
  animation : TabAnimation
};

export type TabLoaderProps = {
  component:string;
  props?: Record<string, unknown>;
};
