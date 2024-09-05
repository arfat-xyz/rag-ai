import { useEffect, useState } from "react";
import useConversation from "./useConversation";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/seven/chat?id=${selectedConversation?.id}`
        );
        const data = await res.json();
        setMessages(data?.messagses);
      } catch (error) {
        // toast.error(error?.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?.id) getMessages();
  }, [selectedConversation?.id, setMessages]);

  return { messages, loading, setMessages };
};
export default useGetMessages;
