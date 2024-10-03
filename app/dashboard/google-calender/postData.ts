"use server";

import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";

export async function postData(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  const message = formData.get("message");
  const id = formData.get("id");
  // const data = await prisma.inboxMessage.create({
  //   data: {
  //     message: message as string,
  //     email: session?.user?.email,
  //   },
  // });
  const data = await prisma.message.create({
    data: {
      conversationId: id as string,
      message: message as string,
      messageOwner: "Author",
    },
  });
  // const pusher = new Pusher({
  //   appId: process.env.PUSHER_APP_ID,
  //   key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  //   secret: process.env.PUSHER_SECRET,
  //   cluster: process.env.PUSHER_CLUESTER,
  //   useTls: true,
  // });
  // pusherServer.trigger("message-chat", `${conversation?.id}`, {
  //   data: `${JSON.stringify({
  //     data: [
  //       {
  //         id: v4(),
  //         role: "user",
  //         content: input,
  //       },
  //       {
  //         id: v4(),
  //         role: "assistant",
  //         content: choices?.choices[0].message?.content,
  //       },
  //     ],
  //   })}\n\n`,
  // });
  await pusherServer.trigger("message-chat", id as string, {
    data: `${JSON.stringify({
      data: [
        {
          id: data.id,
          role: "author",
          content: message,
        },
      ],
    })}\n\n`,
  });
  // await pusherServer.trigger("message-chat", id as string, {
  //   data: `${JSON.stringify(data)}\n\n`,
  // });
}
