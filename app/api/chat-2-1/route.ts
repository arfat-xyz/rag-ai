import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { supabaseClient } from "@/lib/open-ai-functions";
export async function POST(request: Request) {
  const { input, messages, chatbotId } = await request.json();
  const llm = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o",
    temperature: 0.7,
  });
  //   Creating 2 template as required
  const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
    conversation history: {conv_history}
  question: {question} 
  standalone question:`;
  const answerTemplate = `You are a helpful and friendly support bot who can answer a given question based on the context provided and the conversation history. Try to find the answer in the context. Always speak as if you were chatting to a friend.
  context: {context}
  conversation history: {conv_history}
    question: {question}
    answer: `;
  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);
  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  // criating conversation history
  const conv_history = messages
    .map((mess: { role: string; content: any }) => {
      if (mess.role === "user") return `Human: ${mess.content}`;
      else return `AI: ${mess.content}`;
    })
    .join("\n\n");

  // Creating OPENAI embeddings to transform text into dimensional array
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Selecting vector store.
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "documents3",
    queryName: "match_documents4",
    // filter: { chatbotId },
  });

  // creating retriever for getting related data from db
  const retriever = vectorStore.asRetriever({
    metadata: {
      chatbotid: chatbotId,
    },
  });
  const dataExtra = await vectorStore.similaritySearch(input, 1, {
    chatbotid: chatbotId,
  });

  const standaloneQuestionChain = RunnableSequence.from([
    standaloneQuestionPrompt,
    llm,
  ]);
  const retrieverChain = RunnableSequence.from([
    ({ orginal }) => orginal.question,
    retriever,
    (data) =>
      data.map((d: { pageContent: string }) => d.pageContent).join("\n\n"),
    llm,
  ]);
  const answerChain = RunnableSequence.from([answerPrompt, llm]);
  const chain = RunnableSequence.from([
    {
      question: standaloneQuestionChain,

      //RunnablePassthrough use for adding extra object keys
      orginal: new RunnablePassthrough(),
    },
    {
      context: retrieverChain,
      question: ({ orginal }) => orginal.question,
      conv_history: ({ orginal }) => orginal.conv_history,
    },
    answerChain,
  ]);
  const response = await chain.invoke({
    question: input,
    conv_history,
  });
  return Response.json({ answer: response });
}
