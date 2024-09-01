"use client";
import { Chatbot5 } from "@prisma/client";
import { MoveLeft, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Markdown from "react-markdown";

const ChatbotClientComponent = ({
  params,
  chatbotData,
  value,
}: {
  params: { chatbotId: string };
  chatbotData: Chatbot5;
  value: string;
}) => {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    // {
    //   role: "user",
    //   content: "arfat",
    // },
    // { role: "ai", content: "rahman" },
  ]);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    const input = e.target.userInput.value;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    e.target.userInput.value = "";
    const answer = await fetch(`/api/${value}/chat`, {
      method: "POST",
      body: JSON.stringify({
        input,
        messages: messages,
        chatbotId: params.chatbotId,
      }),
    })
      .then((data) => data.json())
      .then((result) => result.answer)
      .finally(() => {
        setLoading(false);
      });
    setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    setLoading(false);
  };
  return (
    <>
      <div className="w-full h-[100vh-30px] flex justify-center items-center">
        <div className="w-full md:w-[96] border p-4 dark:bg-white dark:text-black relative">
          <Link
            href={"/dashboard/five"}
            className="absolute top-0 left-0 border rounded-full p-1 w-10 h-10 bg-white flex justify-center items-center"
          >
            {" "}
            <MoveLeft />
          </Link>
          <div className="">
            <img src="/next.svg" className="logo" />
            <p className="sub-heading">{chatbotData?.name}</p>
            <p className="sub-heading">{chatbotData?.userEmail}</p>
          </div>
          <div className="h-96 overflow-y-auto w-full gap-4 flex flex-col">
            {messages.map((message, i) => {
              return (
                <div
                  className={`w-full text-wrap flex gap-2 items-center shadow-lg rounded-lg py-4
            `}
                  key={i}
                >
                  <div className="bg-first w-6 h-6 rounded-full">
                    {message.role === "user" ? (
                      <Image
                        alt="Arfat AI"
                        src={"/logo-only.png"}
                        className="bg-first rounded-full"
                        width={30}
                        height={30}
                      />
                    ) : (
                      <User />
                    )}
                  </div>
                  <div>
                    <Markdown>{message.content}</Markdown>
                  </div>
                </div>
              );
            })}
            {loading && <div className="w-full ">thinking....</div>}
          </div>
          <form id="form" onSubmit={handleSubmit} className="flex w-full">
            <input
              name="userInput"
              type="text"
              className="p-2 border border-gray-600 rounded-l-lg flex-1 dark:bg-white dark:text-black"
              required
            />
            <button
              id="submit-btn"
              type="submit"
              disabled={loading}
              className="text-white px-11 bg-green-600 rounded-r-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatbotClientComponent;
