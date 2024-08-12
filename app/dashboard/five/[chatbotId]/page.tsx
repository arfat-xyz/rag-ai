import React from "react";
import ChatbotClientComponent from "./client-component";
import prisma from "@/prisma";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { chatbotId: string } }) => {
  const chatbotData = await prisma.chatbot5.findUnique({
    where: {
      id: params.chatbotId,
    },
  });
  if (!chatbotData?.id) {
    redirect("/deshboard/five");
  }
  console.log(chatbotData);
  return (
    <div>
      <ChatbotClientComponent params={params} chatbotData={chatbotData} />
    </div>
  );
};

export default page;
