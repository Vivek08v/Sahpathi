import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: "http://localhost:3000",
})

io.on('connection', (socket) => {
    console.log('A client connected', socket.id);
    let currentRoom = null;

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        //
    })


    socket.on('joinRoom', async ({ roomId, name, role = 'student'}, callback) => {
        try {
            const room = roomsManager.getRoom(roomId);

            if(!room) {
                return callback({ error: 'Room not found' });
            }

            currentRoom = roomId;
            socket.join(roomId);
        }
        catch(err){

        }
    })
})

export {app, server, io};