export type Message = {
  conversation: string;
  sender: string;
  type: "text";
  content: string;
  status: "sent";
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type MessageResponse = {
  data: Message;
};

export type CreateMessagePayload = {
  conversationId: string;
  content: string;
};

export type UpdateMessagePayload = {
  content: string;
};