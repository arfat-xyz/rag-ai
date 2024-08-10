import { Server } from "Socket.IO";

const SocketHandler = (req, res) => {
  console.log("dim naki murgi");
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
