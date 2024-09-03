"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";

export async function postData(formData: FormData) {
  "use server";
  const Pusher = require("pusher");
  const session = await getServerSession(authOptions);
  const message = formData.get("message");
  const data = await prisma.inboxMessage.create({
    data: {
      message: message as string,
      email: session?.user?.email,
    },
  });
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUESTER,
    useTls: true,
  });

  await pusher.trigger("chat", "hello", {
    message: `${JSON.stringify(data)}\n\n`,
  });
}
