import { OpenAI } from "openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { supabaseClient } from "@/lib/open-ai-functions";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import prisma from "@/prisma";
export async function POST(request: Request) {
  const { input, messages, chatbotId, userId } = await request.json();

  const adminUser = await prisma.chatbot7
    .findUnique({
      where: {
        id: chatbotId,
      },
      select: {
        userEmail: true,
      },
    })
    .then(
      async (res) =>
        await prisma.user.findUnique({
          where: {
            email: res?.userEmail,
          },
        })
    );
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

  // Printing returned context
  // console.log(similaritySearchResults);
  // for (const doc of similaritySearchResults) {
  //   console.log(
  //     `* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]\n\n\n\n\n`
  //   );
  // }

  // Use OpenAI to make the response conversational
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

  //   // Use OpenAI to make the response conversational from chatgpt
  //   const chatMessages: ChatCompletionMessageParam[] = [
  //     {
  //       role: "system",
  //       content: `
  //     You are a helpful assistant tasked with answering questions based primarily on the {Context} provided in the {Question}.

  // - Your priority is to find answers within the {Context}. If the information is not explicitly available, respond with, "Sorry, I don't know the answer."
  // - If the question seems unrelated to the {Context}, gently steer the conversation back by saying, "This topic is not covered in the provided context."
  // - Avoid providing detailed answers to questions that are clearly outside the {Context}, but you can acknowledge them briefly if relevant.
  // - Do not make up answers or provide speculative information; rely on the {Context} wherever possible.

  // Please respond in the language in which the user asks the question.

  // `,
  //     },
  //   ];
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
  if (!choices?.choices[0].message?.content) {
    return new Response("Something went wrong", { status: 403 });
  }

  console.log({ choices, similaritySearchResults, messages });
  // criating conversation history
  // const conv_history = messages
  //   .map((mess: { role: string; content: any }) => {
  //     if (mess.role === "user") return `Human: ${mess.content}`;
  //     else return `AI: ${mess.content}`;
  //   })
  //   .join("\n\n");

  // Creating OPENAI embeddings to transform text into dimensional array
  // const embeddings = new OpenAIEmbeddings({
  //   openAIApiKey: process.env.OPENAI_API_KEY,
  // });

  // Create an embedding vector representing the query
  // async function createEmbedding(input: string) {
  //   const embeddingResponse = await llm.embeddings.create({
  //     model: "text-embedding-ada-002",
  //     input,
  //   });
  //   return embeddingResponse.data[0].embedding;
  // }

  // // Query Supabase and return a semantically matching text chunk
  // async function findNearestMatch(embedding: any) {
  //   const { data } = await supabaseClient.rpc("match_documents7_1", {
  //     query_embedding: embedding,
  //     match_threshold: 0.5,
  //     match_count: 1,
  //   });
  //   return data[0].content;
  // }

  // Trying to update it to the database
  let conversation = await prisma.conversation.findFirst({
    where: {
      adminId: adminUser?.id,
      chatbotId,
    },
  });
  if (!conversation?.id) {
    conversation = await prisma.conversation.create({
      data: {
        userId,
        chatbotId,
        adminId: adminUser?.id,
        messageArray: [],
      },
    });
  }
  const newMessage = await prisma.message.createMany({
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
  console.log({ conversation, newMessage });

  return Response.json({ answer: choices?.choices[0].message?.content });
}
