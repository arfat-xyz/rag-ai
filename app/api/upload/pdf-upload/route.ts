import { authOptions } from "@/lib/auth";
import prisma from "@/prisma";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { user } = session;
    // Validate user subscription plan

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return new Response("Missing filename", { status: 400 });
    }
    const validExtensions = ["pdf"];
    // console.log(
    //   !validExtensions.includes(filename.split(".").pop()!),
    //   filename.split(".").pop(),
    //   "from upload"
    // );
    if (!validExtensions.includes(filename.split(".").pop()!)) {
      return new Response(
        `Invalid file extension, check the documentation for more information.`,
        { status: 400 }
      );
    }

    if (!request.body) {
      return new Response("Missing body", { status: 400 });
    }

    const blob = await put(filename, request.body, {
      access: "public",
    });

    // GET OPENAPI key from todvob
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey)
      return new Response("Invalid OpenAI API key", {
        status: 400,
        statusText: "Invalid OpenAI API key",
      });

    const openai = new OpenAI({
      apiKey: openAIKey,
    });

    // fine tuning file
    const file = await openai.files.create({
      file: await fetch(blob.url),
      purpose: "assistants",
    });

    // uploading to out db
    await prisma.file.create({
      data: {
        blobUrl: blob.url,
        userEmail: user?.email as string,
        fileName: filename,
        openAIFileId: file.id,
      },
    });

    return NextResponse.json({ ...blob }, { status: 201 });
  } catch (error) {
    console.error(error);

    return new Response(null, { status: 500 });
  }
}
