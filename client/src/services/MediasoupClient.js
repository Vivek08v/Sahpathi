import * as mediasoupClient from 'mediasoup-client';
import { io } from 'socket.io-client';

class MediasoupClient {
    constructor() {
        this.socket = null;
        this.device = null;
        this.producerTransport = null;
        this.consumerTransport = null;
        this.producers = new Map();
        this.consumers = new Map();
        this.isConnected = false;
        this.roomId = null;
        this.peerId = null;
        this.displayName = null;
        this.role = null;
        this.peers = new Map();
        //
    }

    async init(socketUrl = 'http://localhost:4000') {
        if(!this.socket) {
            this.socket = io(socketUrl);
        }

        this.socket.on('connect', () => {
            this.peerId = this.socket.id;
            this.isConnected = true;
            console.log('Connected to socket with peer/socket id: ', this.peerId);
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
            console.log('Disconnected from socket');
        })

        //

        try {
            this.device = new mediasoupClient.Device();
        }
        catch(err){
            console.error('Could not create Mediasoup Device: ', err);
            throw err;
        }
    }

    async joinRoom(roomId, displayName, role = 'student') {
        if(!this.isConnected) {
            throw new Error('Not connected to signaling server');
        }

        return new Promise((resolve, reject) => {
            this.socket.emit('joinRoom', {roomId, name: displayName, role}, async (response) => {
                if(response.error) {
                    return reject(new Error(response.error));
                }

                this.roomId = roomId;
                this.displayName = displayName;
                this.role = role;

                const { roomData, routerRtpCapabilities } = response;
            })
        })
    }


    async connectConsumer(peerId, producerId, kind){

    }
}