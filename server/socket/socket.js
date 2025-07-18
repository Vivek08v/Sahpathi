import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: "http://localhost:3000",
})

io.on("hi", {

})

export {app, server, io};