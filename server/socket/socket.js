import {Server} from "socket.io";
import http from "http";
import express from "express";

import roomsManager from "../mediasoup/RoomsManager";

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

            if(role === 'teacher' && room.isTeacherAssigned) {
                role = 'student';
            }

            const peer = room.addPeer(socket.id, name, role);

            const routerRtpCapabilities = room.router.rtpCapabilities;

            socket.to(roomId).emit('newPeer', {
                peerId: socket.id,
                name, 
                role
            });

            callback({
                roomData: room.toJSON(),
                routerRtpCapabilities
            });
        }
        catch(err){
            console.error('Error joining room: ', error);
            callback({error: err.message });
        }
    });


    socket.on('createWebRtcTransport', async ({roomId, transportId, dtlsParameters }, callback) => {
        try{
            const room = roomsManager.getRoom(roomId);

            if(!room) {
                return callback({ error: 'Room not found' });
            }

            const transport = await room.createWebRtcTransport(socket.id);
            callback(transport);
        }
        catch(err){
            console.error('Error creating WebRtc transport:', err)
            callback({error: err.message});
        }
    });

    socket.on('connectWebRtcTransport', async ({ roomId, transportId, dtlsParameters }, callback) => {
        try {
            const room = roomsManager.getRoom(roomId);

            if(!room) {
                return callback({ error: 'Room not found' });
            }

            await room.connectWebRtcTransport(transportId, dtlsParameters);
            callback({ success: true });
        }
        catch(err){
            console.error('Error connecting WebRTC transport: ', err);
            callback({ error: err.message });
        }
    })
})

export {app, server, io};