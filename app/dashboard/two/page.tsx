import AddChatbot2Component from "@/components/add-chatbot-2";
import { AddPdfComponent } from "@/components/add-pdf";
import { AddPdfComponent2 } from "@/components/add-pdf-2";
import DeleteChatbot2Component from "@/components/delete-chatbot-2";
import DeletePdfComponent from "@/components/delete-pdf";
import DeletePdf2Component from "@/components/delete-pdf-2";
import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const DashboardTwoPage = async () => {
  const user = await getCurrentUser();
  if (!user?.email) {
    redirect(authOptions?.pages?.signIn || "/login");
  }
  const files = await prisma.file2.findMany({
    where: {
      userEmail: user?.email,
    },
  });
  const chatbots = await prisma.chatbot2.findMany({
    where: {
      userEmail: user?.email,
    },
  });
  return (
    <>
      {" "}
      <>
        <div className="">
          <div className="w-full min-h-24 bg-gray-100  p-4 mt-8 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl">All uploaded files</h1>{" "}
              <AddPdfComponent2 />
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
                        <DeletePdf2Component
                          id={file.id}
                          url={file.blobUrl}
                          openAIFileId={file.openAIFileId}
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
              <AddChatbot2Component
                files={files.map((f) => ({
                  value: f.id,
                  label: f.fileName,
                  ...f,
                }))}
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
                        <Link href={`/dashboard/two/${bot.id}`}>
                          {bot.name}
                        </Link>
                        <DeleteChatbot2Component id={bot.id} />
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
        </div>
      </>
    </>
  );
};

export default DashboardTwoPage;
