"use client";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const { data: session } = useSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className=" lg:max-w-largeScreen">
        <div className="w-full md:w-96 bg-gray-300 px-3 py-8 rounded-lg">
          <h1 className="text-2xl text-center dark:text-black">Login</h1>
          <div className="flex justify-center gap-4">
            {" "}
            <Button onClick={() => signIn("google")}>
              <FaGoogle />
            </Button>
            <Button onClick={() => signIn("github")}>
              <FaGithub />
            </Button>
          </div>
          {/* <form className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="rounded-lg p-2"
              name="email"
              id="email"
            />
            <label htmlFor="passwortd">Password</label>
            <input
              type="password"
              className="rounded-lg p-2"
              name="password"
              id="password"
            />
          </form> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
