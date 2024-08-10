import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
export async function POST(request: Request) {
  const io = new Server(server);
  return Response.json({ answer: "nai" });
}
