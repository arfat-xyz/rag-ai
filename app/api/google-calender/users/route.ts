import prisma from "@/prisma";

export async function GET(request: Request) {
  // const {
  //   query: { id },
  // } = request;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const email = searchParams.get("email");
  if (!email) {
    return new Response("User not found", { status: 403 });
  }
  const getAllConversation = await prisma.conversation.findMany({
    where: {
      adminEmail: email,
    },
    include: { messages: true },
  });

  return Response.json({ getAllConversation });
}
