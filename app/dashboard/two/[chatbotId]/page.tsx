"use client";
import { User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Chatbot = ({ params }: { params: { chatbotId: string } }) => {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
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
    const answer = await fetch("/api/chat-2-1", {
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
    setMessages((prev) => [...prev, { role: "ai", content: answer }]);
    setLoading(false);
  };
  return (
    <>
      <div className="w-full h-[100vh-30px] flex justify-center items-center">
        <div className="w-full md:w-96 border p-4 ">
          <div className="">
            <img src="/next.svg" className="logo" />
            <p className="sub-heading">Knowledge Bank</p>
          </div>
          <div className="h-96 overflow-y-auto w-full gap-4 flex flex-col">
            {messages.map((message, i) => (
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
                {message.content}
              </div>
            ))}
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

export default Chatbot;
