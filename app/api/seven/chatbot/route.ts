import { authOptions } from "@/lib/auth";
import { callSplitPdf, supabaseClient } from "@/lib/open-ai-functions";
import prisma from "@/prisma";
import { File } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
// export const maxDuration = 300;
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 403 });
    }
    const { user } = session;
    const data = await request.json();
    const { files, name }: { files: File[]; name: string } = data;

    const chatbot = await prisma.$transaction(
      async (_tx) => {
        const createChatbot = await _tx.chatbot7.create({
          data: { name, userEmail: user?.email! },
        });
        const pdfDocs = await Promise.all(
          files.map(
            async (f) => await callSplitPdf(f.blobUrl, createChatbot.id)
          )
        ).then((res) => res.flat());
        // const store = new SupabaseVectorStore(new OpenAIEmbeddings(), {
        //   client: supabaseClient,
        //   tableName: "documents7_1",
        // });
        // await store.addDocuments(pdfDocs).then((res) => {
        //   console.log(res, pdfDocs, pdfDocs.length);
        // });
        // const store2 = new SupabaseVectorStore(new OpenAIEmbeddings(), {
        //   client: supabaseClient,
        //   tableName: "documents",
        //   queryName: "match_documents",
        //   filter: {
        //     chatbotId: createChatbot.id,
        //   },
        // });

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

        const storedDataIdArray = await vectorStore.addDocuments(pdfDocs);
        if (storedDataIdArray.length > 0) {
          return createChatbot;
        } else {
          throw new Error("Data not stored in DB", { cause: "hudai" });
        }
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 300000, // default: 5000
      }
    );

    return NextResponse.json({ ...chatbot, success: true }, { status: 201 });
  } catch (error) {
    console.error("error", error);

    return new Response(null, { status: 500 });
  }
}
