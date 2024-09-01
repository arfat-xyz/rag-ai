import React from "react";
import ChatbotClientComponent from "./client-component";
import prisma from "@/prisma";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { chatbotId: string } }) => {
  console.log(params);
  const chatbotData = await prisma.chatbot7.findUnique({
    where: {
      id: params.chatbotId,
    },
  });
  if (!chatbotData?.id) {
    redirect("/deshboard/seven");
  }
  console.log(chatbotData);
  return (
    <div>
      <ChatbotClientComponent
        params={params}
        chatbotData={chatbotData}
        value={"seven"}
      />
    </div>
  );
};

export default page;
