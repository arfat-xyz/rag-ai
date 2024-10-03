"use client";
import SingleConversation from "./conversationComponent";
import useGetConversations from "./conversation-context-provider";
import useConversation from "./useConversation";
import MessageContainer from "./MessageContainer";
import { useState } from "react";
import showDown from "showdown";
const AllInboxClient = () => {
  const { loading, conversations } = useGetConversations();
  const { selectedConversation } = useConversation();
  const [readmeText, setReadmeText] = useState("");
  const [htmlText, setHtmlText] = useState("");
  const [solidText, setSolidText] = useState("");

  const converter = new showDown.Converter();
  return (
    <>
      {loading ? (
        "loading... "
      ) : (
        <>
          <div className="w-full min-h-24 bg-gray-100  p-4 mt-8 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl">All Inboxed</h1>
            </div>
            <div className="flex gap-9 sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden w-auto bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
              <div className="py-2 flex flex-col overflow-auto">
                {conversations.map((c) => (
                  <div className={c.id} key={c.id}>
                    <SingleConversation key={c.id} conversation={c} />
                  </div>
                ))}
                {/* <SingleConversation /> */}
              </div>{" "}
              {selectedConversation?.id ? (
                <MessageContainer />
              ) : (
                <>no chat selected</>
              )}
            </div>
          </div>
          <div className="w-full min-h-24 bg-gray-100  p-4 mt-8 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl">Convert Readme to html</h1>
            </div>
            <span>Readme</span>

            <textarea
              name="readme"
              id="readme"
              cols={30}
              rows={10}
              onChange={(e) => {
                const value = e.target.value;
                setReadmeText(value);
                const htmlContent = converter.makeHtml(value);
                const plainText = htmlContent.replace(/<[^>]+>/g, "");
                setHtmlText(converter.makeHtml(htmlContent));
                setSolidText(plainText);
                console.log({ plainText: plainText.length });
              }}
              value={readmeText}
              className="w-full p-2"
            ></textarea>
            <span className="mt-5">HTML</span>
            <textarea
              name="html"
              className="w-full p-2"
              id=""
              value={htmlText}
              cols={30}
              rows={10}
            ></textarea>
            <div className="overflow-auto">{solidText}</div>
          </div>
        </>
      )}
    </>
  );
};

export default AllInboxClient;
