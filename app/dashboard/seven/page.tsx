import AddChatbotComponentDynamic from "@/components/add-chatbot-dynamic";
import { AddPdfComponentDynamic } from "@/components/add-pdf-dynamic";
import DeleteChatbotComponentDynamic from "@/components/delete-chatbot-dynamic";
import DeletePdfComponentDynamic from "@/components/delete-pdf-dynamic";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChatLinkComponent from "./chatLinkComponent";
import Conversation from "./conversationComponent";
import MessageContainer from "./MessageContainer";

const DashboardTwoPage = async () => {
  const user = await getCurrentUser();

  // creating an instance of PUsher which import from pusher-js

  if (!user?.email) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const files = await prisma.file7.findMany({
    where: {
      userEmail: user?.email,
    },
  });
  const chatbots = await prisma.chatbot7.findMany({
    where: {
      userEmail: user?.email,
    },
  });
  return (
    <>
      <div className=" dark:text-black">
        <div className="w-full min-h-24 bg-gray-100  p-4 mt-8 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl">All uploaded files</h1>
            <AddPdfComponentDynamic value="seven" />
          </div>
          {files.length === 0 ? (
            <>
              <div className="w-full h-28 flex flex-col justify-center items-center bg-white rounded-lg mt-4">
                <h3 className="text-xl">No files available</h3>
                <p>Please upload a file</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-full flex flex-col gap-3 mt-6">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="hover:bg-white rounded-lg transition-colors duration-300 py-1 px-2"
                  >
                    <h2 className="text-2xl underline flex justify-between items-center">
                      <Link href={file.blobUrl} target="_blank">
                        {file.fileName}
                      </Link>
                      <DeletePdfComponentDynamic
                        id={file.id}
                        url={file.blobUrl}
                        openAIFileId={file.openAIFileId}
                        value="seven"
                      />
                    </h2>
                    <p className="text-foreground">
                      {file.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="w-full min-h-24 bg-gray-100  p-4 mt-8 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl">All Chatbots</h1>
            <AddChatbotComponentDynamic
              files={files.map((f) => ({
                value: f.id,
                label: f.fileName,
                ...f,
              }))}
              value="seven"
            />
          </div>
          {files.length === 0 ? (
            <>
              <div className="w-full h-28 flex flex-col justify-center items-center bg-white rounded-lg mt-4">
                <h3 className="text-xl">No files available</h3>
                <p>Please upload a file</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-full flex flex-col gap-3 mt-6">
                {chatbots.map((bot) => (
                  <div
                    key={bot.id}
                    className="hover:bg-white rounded-lg transition-colors duration-300 py-1 px-2"
                  >
                    <h2 className="text-2xl underline flex justify-between items-center">
                      <ChatLinkComponent
                        id={bot.id}
                        name={bot.name}
                        path={"seven"}
                      />
                      <DeleteChatbotComponentDynamic
                        value="seven"
                        id={bot.id}
                      />
                    </h2>
                    <p className="text-foreground">
                      {bot.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="w-full min-h-24 bg-gray-100  p-4 mt-8 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl">All Inboxed</h1>
          </div>
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
        </div>
      </div>
    </>
  );
};

export default DashboardTwoPage;
