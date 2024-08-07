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
    const deleteFromVector = await supabaseClient
      .from("documents")
      .delete()
      .filter("metadata.chatbotId", "eq", id);
    console.log(deleteFromVector);
    await prisma.chatbot.delete({
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
