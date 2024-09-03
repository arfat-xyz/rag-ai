import React from "react";
import Conversation from "../seven/conversationComponent";
import MessageContainer from "../seven/MessageContainer";

const InboxClientComponent = () => {
  return (
    <div className="flex gap-9 sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden w-auto bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <div className="py-2 flex flex-col overflow-auto">
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
        <Conversation />
      </div>
      <MessageContainer />
    </div>
  );
};

export default InboxClientComponent;
