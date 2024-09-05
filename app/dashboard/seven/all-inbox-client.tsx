"use client";
import { Conversation } from "@prisma/client";
import SingleConversation from "./conversationComponent";
import useGetConversations from "./conversation-context-provider";
import useConversation from "./useConversation";
import MessageContainer from "./MessageContainer";

const AllInboxClient = () => {
  const { loading, conversations } = useGetConversations();
  const { selectedConversation } = useConversation();
  return (
    <div className="w-full min-h-24 bg-gray-100  p-4 mt-8 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">All Inboxed</h1>
      </div>
      <div className="flex gap-9 sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden w-auto bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <div className="py-2 flex flex-col overflow-auto">
          {conversations.map((c) => (
            <div className={c.id} key={c.id}>
              <SingleConversation key={c.id} conversation={c} />
            </div>
          ))}
          {/* <SingleConversation /> */}
        </div>{" "}
        {selectedConversation?.id ? (
          <MessageContainer />
        ) : (
          <>no chat selected</>
        )}
      </div>
    </div>
  );
};

export default AllInboxClient;
