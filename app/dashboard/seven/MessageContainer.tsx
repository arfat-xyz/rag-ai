"use client";
import { Send } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { postData } from "./postData";
import SelectedConversationContext from "./conversation-context-provider";
import useGetMessages from "./getUseMessages";
// const messages: {
//   author: "User" | "Assistant" | "Admin";
//   message: string;
// }[] = [
//   {
//     author: "User",
//     message: "hi",
//   },
//   {
//     author: "Assistant",
//     message: "How are you",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "Admin",
//     message: "What do you want",
//   },
//   {
//     author: "User",
//     message: "hi",
//   },
// ];
const MessageContainer = () => {
  const [message, setMessage] = useState("");
  const [totalMessage, setTotalMessage] = useState([]);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { messages, loading } = useGetMessages();
  // const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  //   cluster: "ap2",
  // });

  // Create a channel using pusher
  // const channel = pusher.subscribe("chat");
  // channel.bind("hello", function (data: any) {
  //   const paredComments = JSON.parse(data.message);
  //   console.log({ paredComments, data });
  //   setTotalMessage((prev) => [...prev, paredComments]);
  // });
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);
  // const getAllMessages = async () => {
  //   await fetch(`api/seven/chat?id=${selectedConversation}`).then((res) =>
  //     res.json()
  //   );
  // };
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("message", message);
    await postData(formData)
      .then((res) => console.log({ res }))
      .catch((e) => console.log({ e }));
    setMessage("");
  };

  return (
    <div className="md:max-w-auto flex flex-col">
      <>
        {/* Header */}
        <div className="bg-slate-500 px-4 py-2 mb-2">
          <span className="label-text">To:</span>{" "}
          <span className="text-gray-900 font-bold">
            {"selectedConversation?.fullName"}
          </span>{" "}
          <br />
          <span className="label-text">Username:</span>{" "}
          <span className="text-gray-900 font-bold">
            {"selectedConversation?.username"}
          </span>
        </div>

        <div className="px-4 flex-1 overflow-auto">
          {messages?.length
            ? messages.map((message, i) => (
                <div key={i} className="h-auto" ref={lastMessageRef}>
                  <div
                    className={`chat ${
                      message?.role === "user" ? "chat-end" : "chat-start"
                    }`}
                  >
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <Image
                          width={48}
                          height={48}
                          alt="Tailwind CSS chat bubble component"
                          src={`https://avatar.iran.liara.run/public/boy?username=arfat`}
                        />
                      </div>
                    </div>
                    <div
                      className={`chat-bubble text-white ${
                        message.role === "user"
                          ? "bg-blue-500"
                          : message.role === "assistant"
                          ? "bg-customSecondary"
                          : "`"
                      } pb-2`}
                    >
                      {message?.content}
                    </div>
                  </div>
                </div>
              ))
            : "no catting"}
        </div>
        <form className="px-4 my-3" onSubmit={handleSubmit}>
          <div className="w-full relative">
            <input
              type="text"
              className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
              placeholder="Send a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="absolute inset-y-0 end-0 flex items-center pe-3"
            >
              {/* <div className="loading loading-spinner"></div> */}
              <Send />
            </button>
          </div>
        </form>
      </>
    </div>
  );
};

export default MessageContainer;
