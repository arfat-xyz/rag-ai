import { authOptions } from "@/lib/auth";
import { supabaseClient } from "@/lib/open-ai-functions";
import prisma from "@/prisma";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await request.json();
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 403 });
    }
    // const deleteFromVector = await supabaseClient
    //   .from("documents5_1")
    //   .delete()
    //   .filter("metadata.chatbotId", "eq", id);
    // console.log(deleteFromVector);


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
    const { data, error } = await supabaseClient
    .from('documents5_1') // Replace with your actual table name
    .select('id')          // Use '*' to select all columns
    .contains('metadata', { "chatbotId": id }); // JSONB filter
  

    console.log(data, error, id);
    // await prisma.chatbot5.delete({
    //   where: {
    //     id: id,
    //   },
    // });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);

    return new Response(null, { status: 500 });
  }
}
