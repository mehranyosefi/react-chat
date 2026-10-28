export type ConversationItem = {
  conversationId: string;
  conversationKey: string;
  participants: {
    _id: string;
    username: string;
    name: string;
    avatar: string | null;
  }[];
};
