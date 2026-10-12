import { Conversation } from "../../services/conversation/conversation.type";

export type ConversationState={
    conversations:Conversation[];

    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;

    createStatus : "idle" | "loading" | "succeeded" | "failed";
    createError : string | null;
};