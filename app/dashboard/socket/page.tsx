"use client";
import { useEffect } from "react";
import io from "socket.io-client";
let socket;
const SocketPage = () => {
  useEffect(() => socketInitializer(), []);

  const socketInitializer = async () => {
    await fetch("/api/test");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });
  };

  return (
    <>
      <h1>Arfat</h1>
    </>
  );
};

export default SocketPage;
