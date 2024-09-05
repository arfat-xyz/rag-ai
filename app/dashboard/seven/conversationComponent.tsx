"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import SelectedConversationContext from "./conversation-context-provider";
import { Conversation } from "@prisma/client";
import useConversation from "./useConversation";

const SingleConversation = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?.id === conversation?.id;
  const isOnline = true;
  return (
    <div
      className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${
        isSelected ? "bg-sky-500" : ""
      }`}
      onClick={() => setSelectedConversation(conversation)}
    >
      <div className={`avatar ${isOnline ? "online" : ""}`}>
        <div className="w-12 rounded-full">
          <Image
            width={48}
            height={48}
            src={`https://avatar.iran.liara.run/public/boy?username=arfat`}
            alt="user avatar"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex gap-3 justify-between">
          <p className="font-bold text-black">{conversation.userId}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleConversation;
