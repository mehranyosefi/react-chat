import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TabAnimation, TabItem } from "../../components/tabs/tabs.type";

interface TabState {
  tabs: TabItem[];
  activeTabId: string;
  history: string[];
  animation: TabAnimation;
}

const initialState: TabState = {
  tabs: [
    {
      id: "conversations",
      component: "ConversationList",
    },
    {
      id: "contacts",
      component: "ContactList",
    },
    {
      id: "chatroom",
      component: "ChatRoom",
    },
  ],

  activeTabId: "conversations",
  history: ["conversations"],
  animation: "forward",
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    pushTab(state, action: PayloadAction<string>) {
      const tabId = action.payload;
      if (state.activeTabId === tabId) return;

      state.history.push(tabId);
      state.activeTabId = tabId;
      state.animation = "forward";
    },
    popTab(state) {
      if (state.history.length <= 1 && state.activeTabId === "contacts") {
        state.activeTabId = "conversations";
        return;
      }
      if (state.history.length <= 1) return;

      state.history.pop();
      state.activeTabId = state.history[state.history.length - 1];
      state.animation = "backward";
    },
    setIntitailTab(state, action: PayloadAction<string>) {
      const tabId = action.payload;
      state.activeTabId = tabId;
      state.history = [tabId];
      state.animation = "backward";
    },
  },
});

export const { pushTab, popTab, setIntitailTab } = tabSlice.actions;
export default tabSlice.reducer;
