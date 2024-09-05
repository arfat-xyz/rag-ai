"use client";
import { Conversation } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// const SelectedConversationContext = () => {
//   const [selectedConversation, setSelectedConversation] =
//     useState<null | Conversation>(null);
//   const [allmessagesFromConversation, setAllmessagesFromConversation] =
//     useState<{ role: "author" | "assistant" | "user"; content: string }[]>([]);
//   useEffect(() => {
//     console.log("it's calling");
//     const getAllMessages = async () =>
//       await fetch(`/api/seven/chat?id=${selectedConversation?.id}`).then(
//         (res) =>
//           res
//             .json()
//             .then((data) => setAllmessagesFromConversation(data.messages))
//             .catch((e) => console.log(e))
//       );
//     if (selectedConversation?.id) getAllMessages();
//   }, [
//     selectedConversation,
//     selectedConversation?.id,
//     setAllmessagesFromConversation,
//     allmessagesFromConversation,
//   ]);
//   return {
//     selectedConversation,
//     setSelectedConversation,
//     allmessagesFromConversation,
//     setAllmessagesFromConversation,
//   };
// };
// export default SelectedConversationContext;

const useGetConversations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[] | []>([]);
  const { data: userData } = useSession();

  useEffect(() => {
    const getConversations = async () => {
      if (!userData?.user) {
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/seven/users?email=${userData?.user?.email}`
        );
        const data = await res.json();
        if (!data) {
          throw new Error(data.message);
        }
        setConversations(data?.getAllConversation);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};
export default useGetConversations;
