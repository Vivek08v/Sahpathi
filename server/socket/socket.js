import {Server} from "socket.io";
import http from "http";
import express from "express";

import roomsManager from "../mediasoup/RoomsManager.js";
import { Classroom } from "../models/classroom.model.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: "http://localhost:3000",
})

// Clean up empty rooms periodically
setInterval(() => {
    console.log("setInterval Ran...")
    roomsManager.cleanUpRooms();
}, 120000); // 5 minutes

io.on('connection', (socket) => {
    console.log('A client connected', socket.id);
    let currentRoom = null;

    socket.on('leaveRoom', async ({ roomId }, callback) => {
        try {
            const room = roomsManager.getRoom(roomId);
            if (!room) {
                return callback?.({ error: 'Room not found' });
            }

            room.removePeer(socket.id);
            socket.leave(roomId);
            socket.to(roomId).emit('peerClosed', { peerId: socket.id });

            if (room.isRoomEmpty()) {
                await Classroom.findOneAndUpdate({ classId: roomId}, {$set: {status: "Completed"}})
                roomsManager.removeRoom(roomId);
            }

            if (currentRoom === roomId) currentRoom = null;
            callback?.({ success: true });
        } catch (error) {
            console.error('Error leaving room:', error);
            callback?.({ error: error.message });
        }
    });

    socket.on('disconnect', async () => {
        console.log('Client disconnected', socket.id);
        
        if (currentRoom) {
          const room = roomsManager.getRoom(currentRoom);
          if (room) {
            room.removePeer(socket.id);
            
            // Notify other peers about the disconnection
            socket.to(currentRoom).emit('peerClosed', { peerId: socket.id });
            
            // Check if room is empty and remove it
            if (room.isRoomEmpty()) {
              await Classroom.findOneAndUpdate({ classId: currentRoom}, {$set: {status: "Completed"}})
              roomsManager.removeRoom(currentRoom);
            }
          }
        }
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
        catch(error){
            console.error('Error joining room: ', error);
            callback({error: error.message });
        }
    });


    socket.on('createWebRtcTransport', async ({roomId}, callback) => {
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
    });

    socket.on('produce', async ({roomId, transportId, kind, rtpParameters, appData }, callback) => {
        try {
            const room = roomsManager.getRoom(roomId);
            if(!room){
                return callback({ error: 'Room not found' });
            }

            const producer = await room.produce(socket.id, transportId, kind, rtpParameters, appData);

            socket.to(roomId).emit('newProducer', {
                peerId: socket.id,
                producerId: producer.id,
                kind
            });

            callback(producer);
        }
        catch(error) {
            console.log('Error producing: ', error);
            callback({ error: error.message });
        }
    });

    socket.on('resumeConsumer', async ({ roomId, consumerId }, callback) => {
    try {
      const room = roomsManager.getRoom(roomId);
      
      if (!room) {
        return callback?.({ error: 'Room not found' });
      }
      
      await room.resumeConsumer(consumerId);
      callback?.({ success: true });
    } catch (error) {
      console.error('Error resuming consumer', error);
      callback?.({ error: error.message });
    }
  });

    socket.on('getProducers', ({ roomId }, callback) => {
        try{
            const room = roomsManager.getRoom(roomId);
            
            if(!room){
                return callback({error: 'Room not found'});
            }
            
            const producerList = [];
            
            room.peers.forEach(peer => {
                peer.producers.forEach(producerId => {
                    const producer = room.producers.get(producerId);
                    if(producer){
                        producerList.push({
                            peerId: peer.id,
                            producerId: producer.id,
                            kind: producer.kind
                        });
                    }
                    
                });
            })
            
            console.log(`getProducers for room ${roomId}:`, producerList);
            callback({producers: producerList});
        }
        catch(err){
            console.error('Error getting producers: ', error);
            callback({error: error.message});
        }
    });


    socket.on('consume', async({ roomId, transportId, producerId, rtpCapabilities }, callback) => {
        try{
            const room = roomsManager.getRoom(roomId);

            if(!room){
                return callback({error: 'Room not found'});
            }

            const consumer = await room.consume(socket.id, transportId, producerId, rtpCapabilities);
            callback(consumer);
        }
        catch(error){
            console.error('Error consuming: ', error);
            callback({error: error.message });
        }
    });
})

export {app, server, io};