import { Conversation, Message } from "@prisma/client";
import { create } from "zustand";

const useConversation = create<{
  selectedConversation: Conversation | null;
  messages:
    | {
        role: "user" | "assistant" | "author";
        id: string;
        content: string;
      }[]
    | [];
}>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation: Conversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (
    messages: {
      role: "user" | "assistant" | "author";
      id: string;
      content: string;
    }[]
  ) => set({ messages }),
}));

export default useConversation;
