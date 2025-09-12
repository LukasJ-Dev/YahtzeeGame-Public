import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { SocketServer } from "./SocketServer";

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://yahtzee.lukasj.dev/"],
  })
);

export const socketServer: SocketServer = new SocketServer(io);

socketServer.start();

server.listen(8080, () => {
  console.log("Server running...");
});
