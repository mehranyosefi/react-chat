import { ComponentType } from "react";

export type TabItem = {
  id: string;
  component: ComponentType<any>;
  props?: Record<string, unknown>;
  index: number;
  children?: TabItem[];
};

export type TabProps = {
  tabs: TabItem[];
  activeTabId?: string;
  setActiveTabId?: (id: string) => void;
};
export type TabLoaderProps = {
  component: ComponentType<any>;
  props?: Record<string, unknown>;
};
