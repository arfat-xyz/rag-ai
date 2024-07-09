import { authOptions } from "@/lib/auth";
import prisma from "@/prisma";
import { del } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { url, id, openAIFileId } = await request.json();
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 403 });
    }
    const prismaDelete = await prisma.file.delete({
      where: {
        id: id,
      },
    });
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey)
      return new Response("Invalid OpenAI API key", {
        status: 400,
        statusText: "Invalid OpenAI API key",
      });

    const openai = new OpenAI({
      apiKey: openAIKey,
    });
    // Deleting file from openAI

    await openai.files.del(openAIFileId);
    await del(url);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);

    return new Response(null, { status: 500 });
  }
}
