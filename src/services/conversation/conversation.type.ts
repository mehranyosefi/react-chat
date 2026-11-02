export type Conversation = {
  type: "direct";
  participants: {
    _id: string;
    username: string;
    name: string;
    avatar: string | null;
  }[];
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