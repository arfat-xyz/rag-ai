import { OpenAI } from "openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { supabaseClient } from "@/lib/open-ai-functions";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import prisma from "@/prisma";
import { pusherServer } from "@/lib/pusher";
import { v4 } from "uuid";
export async function GET(request: Request) {
  // const {
  //   query: { id },
  // } = request;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const id = searchParams.get("id");
  const getAllConversation = await prisma.conversation.findUnique({
    where: {
      id: id as string,
    },
    include: { messages: true },
  });
  const messagses = getAllConversation?.messages.map((m) => ({
    content: m.message,
    role:
      m.messageOwner === "Assistant"
        ? "assistant"
        : m.messageOwner === "Author"
        ? "author"
        : "user",
    id: m.id,
  }));
  return Response.json({ messagses });
} // using pusher send data for real time chatting
const pushToRealTime = async (
  conversationId: string,
  userText: string,
  botText: string
) => {
  pusherServer.trigger("message-chat", `${conversationId}`, {
    data: `${JSON.stringify({
      data: [
        {
          id: v4(),
          role: "user",
          content: userText,
        },
        {
          id: v4(),
          role: "assistant",
          content: botText,
        },
      ],
    })}\n\n`,
  });
};
export async function POST(request: Request) {
  const { input, messages, chatbotId, userId } = await request.json();

  const chatbot = await prisma.chatbot7.findUnique({
    where: {
      id: chatbotId,
    },
  });
  // if (!adminUser?.id) return new Response("User not found", { status: 403 });
  const llm = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Create opean ai embeddings
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  // create vector store using embeddings
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "documents7_1",
    queryName: "match_documents7_1",
  });

  //Rpc filter function
  // const funcFilter: SupabaseFilterRPCCall = (rpc) =>
  //   rpc.filter("metadata->>chatbotId", "eq", chatbotId);

  // Rpc similar search from vector db
  const similaritySearchResults = await vectorStore
    .similaritySearch(input, 2, {
      chatbotId: chatbotId,
    })
    .then((data) => {
      const onlyData = data.map((d) => d.pageContent).join("\n");
      return onlyData;
    });

    
  const chatMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
      You are an helpful assistant who help user to answer questions according to {Context} given in {Question}.
      If you are unsure and cannot find the answer in the {Context}  say, "Sorry, I don't know the answer."
      If someone ask any questions which out of {Context} even it's a chilly {Question} and ask multiple times do not answer it, say, "Sorry, This is not in my knowledge"
      Please remember previous messages to answer more effeciently but not out of .
      Please do not make up the answer.
      Please answer on that language which user ask`,
    },
  ];

  chatMessages.push(...messages);
  chatMessages.push({
    role: "user",
    content: `Context: ${similaritySearchResults} Question: ${input}`,
  });
  const choices = await llm.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: chatMessages,
    temperature: 0.5,
  });
  if (!choices?.choices[0].message?.content)
    return new Response("Something went wrong", { status: 403 });

  // Trying to update it to the database
  let conversation = await prisma.googleCalenderConversation.findFirst({
    where: { adminEmail: chatbot?.userEmail, userId, chatbotId },
  });
  if (!conversation?.id) {
    conversation = await prisma.googleCalenderConversation.create({
      data: {
        userId,
        chatbotId, // This should link to an existing Chatbot7 record
        adminEmail: chatbot?.userEmail as string,
        messageArray: [],
      },
    });
  }
  await prisma.googleCalenderMessage.createMany({
    data: [
      {
        conversationId: conversation.id,
        message: input,
        messageOwner: "User",
      },
      {
        conversationId: conversation.id,
        message: choices?.choices[0].message?.content,
        messageOwner: "Assistant",
      },
    ],
  });

  await prisma.googleCalenderConversation.findFirst({
    where: {
      id: conversation.id,
    },
    include: { GoogleCalenderMessage: true },
    orderBy: {
      createdAt: "desc",
    },
  });
  // console.log({ addedConversation: addedConversation?.messages });
  pusherServer.trigger("message-chat", `${conversation?.id}`, {
    data: `${JSON.stringify({
      data: [
        {
          id: v4(),
          role: "user",
          content: input,
        },
        {
          id: v4(),
          role: "assistant",
          content: choices?.choices[0].message?.content,
        },
      ],
    })}\n\n`,
  });
  console.log(conversation?.id);

  return Response.json({
    answer: choices?.choices[0].message?.content,
    conversationId: conversation.id,
  });
}
