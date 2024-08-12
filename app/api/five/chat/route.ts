import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "openai";
import {
  SupabaseFilterRPCCall,
  SupabaseVectorStore,
} from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { supabaseClient } from "@/lib/open-ai-functions";
import prisma from "@/prisma";
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
export async function POST(request: Request) {
  const { input, messages, chatbotId } = await request.json();
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
    tableName: "documents5_1",
    queryName: "match_documents5_1",
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
      If you are unsure and cannot find the answer in the {Context}, say, "Sorry, I don't know the answer." 
      Please do not make up the answer. Also ensure word case-sensitive`,
    },
  ];
  chatMessages.push(...messages);
  chatMessages.push({
    role: "user",
    content: `Context: ${similaritySearchResults} Question: ${input}`,
  });
  const { choices } = await llm.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: chatMessages,
  });

  // console.log(choices[0].message?.content, similaritySearchResults, messages);
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
  //   const { data } = await supabaseClient.rpc("match_documents5_1", {
  //     query_embedding: embedding,
  //     match_threshold: 0.5,
  //     match_count: 1,
  //   });
  //   return data[0].content;
  // }

  return Response.json({ answer: choices[0].message?.content });
}
