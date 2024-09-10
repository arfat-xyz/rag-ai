import React from "react";
import ChatbotClientComponent from "./client-component";
import prisma from "@/prisma";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { chatbotId: string } }) => {
  const chatbotData = await prisma.chatbot7.findUnique({
    where: {
      id: params.chatbotId,
    },
  });
  if (!chatbotData?.id) {
    redirect("/deshboard/seven");
  }
  const conversationId = await prisma.conversation
    .findFirst({
      where: {
        chatbotId: chatbotData.id,
        userId: `5b2a6ef8-79b1-4f06-b3ae-9742407acd62`,
      },
      select: {
        id: true,
      },
    })
    .then((d) => d?.id);
  return (
    <div>
      <ChatbotClientComponent
        params={params}
        chatbotData={chatbotData}
        value={"seven"}
        conversationId={conversationId as string}
      />
    </div>
  );
};

export default page;
