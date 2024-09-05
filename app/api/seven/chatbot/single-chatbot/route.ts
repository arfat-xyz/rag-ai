import { authOptions } from "@/lib/auth";
import { supabaseClient } from "@/lib/open-ai-functions";
import prisma from "@/prisma";
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
    //   .from("documents7_1")
    //   .delete()
    //   .filter("metadata.chatbotId", "eq", id);
    // console.log(deleteFromVector);

    //  // Create opean ai embeddings
    //  const embeddings = new OpenAIEmbeddings({
    //   model: "text-embedding-3-small",
    // });
    //   // create vector store using embeddings
    //   const vectorStore = new SupabaseVectorStore(embeddings, {
    //     client: supabaseClient,
    //     tableName: "documents7_1",
    //     queryName: "match_documents7_1",
    //   });

    // deleteting data from vector DB of supabase
    const { data, error } = await supabaseClient
      .from("documents7_1") // Replace with your actual table name
      // .select('id')
      .delete() // Use '*' to select all columns
      .contains("metadata", { chatbotId: id }); // JSONB filter

    // console.log({ id, data, error });
    await prisma.chatbot7.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);

    return new Response(null, { status: 500 });
  }
}
