import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="w-full h-[calc(100vh-40px)] flex justify-center items-center">
      <div className="min-h-24 min-w-40 bg-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 rounded-lg ">
        <Link
          href={"/dashboard/one"}
          className="px-4 py-2 hover:bg-red-400 transition-colors duration-300 underline rounded-lg"
        >
          First chatbot
        </Link>
        <Link
          href={"/dashboard/two"}
          className="px-4 py-2 hover:bg-red-400 transition-colors duration-300 underline rounded-lg"
        >
          Second chatbot
        </Link>
        <Link
          href={"/dashboard/all-user"}
          className="px-4 py-2 hover:bg-red-400 transition-colors duration-300 underline rounded-lg"
        >
          All users chatbot
        </Link>
        <Link
          href={"/dashboard/socket"}
          className="px-4 py-2 hover:bg-red-400 transition-colors duration-300 underline rounded-lg"
        >
          Socket
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
