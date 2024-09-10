import { Conversation, Message } from "@prisma/client";
import { create } from "zustand";

const useConversation = create<{
  selectedConversation: Conversation | null;
  setSelectedConversation: (selectedConversation: Conversation) => void; // Explicitly typing the function
  messages: {
    role: "user" | "assistant" | "author";
    id: string;
    content: string;
  }[];
  setMessages: (
    messages: {
      role: "user" | "assistant" | "author";
      id: string;
      content: string;
    }[]
  ) => void;
}>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;
