"use client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const DeleteChatbotComponentDynamic = ({
  id,
  value,
}: {
  id: string;
  value: string;
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    await fetch(`/api/${value}/chatbot/single-chatbot`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(({ success }: { success: boolean }) => {
        success ? router.refresh() : alert("Something went wrong");
      })
      .finally(() => setIsDeleting(false));
  };
  return (
    <div>
      {isDeleting ? (
        <>
          <div className="w-6 h-6 rounded-full border-customSecondary border-2 border-t-transparent animate-spin"></div>
        </>
      ) : (
        <Trash className="text-red-500 cursor-pointer" onClick={handleDelete} />
      )}
    </div>
  );
};

export default DeleteChatbotComponentDynamic;
