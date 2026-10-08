export type Conversation = {
  type: "direct";
  participants: string[];
  conversationKey: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ConversationsResponse = {
  data: Conversation[];
};

export type ConversationResponse = {
  data: Conversation;
};