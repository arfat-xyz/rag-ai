import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex justify-center items-center bg-gray-400 w-full md:w-96 flex-col px-3 py-9 rounded-lg">
        {" "}
        <h1>Welcom to demo world</h1>
        <Button variant={"ghost"} asChild>
          <Link href={"/dashboard"}>Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
