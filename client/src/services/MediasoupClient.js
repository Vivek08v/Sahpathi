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

                roomData.peers.forEach(peer => {
                    this.peers.set(peer.id, peer);
                });

                try{
                    if(!this.device.loaded) {
                        await this.device.load({ routerRtpCapabilities });
                    }

                    // Create Transport
                    await this.createSendTransport();
                    await this.createReceiveTransport();

                    // Getting existing producers and consume them
                    await this.getExistingProducers();

                    console.log("socket id: ", this.peerId, "joined the room: ", roomData);
                    resolve(roomData);
                }
                catch(error){
                    reject(error);
                }
            })
        })
    }

    async createSendTransport() {
        return new Promise((resolve, reject) => {
            this.socket.emit('createWebRtcTransport', {roomId: this.roomId}, async (response) => {
                if(response.error) {
                    return reject(new Error(response.error));
                }

                try{
                    this.producerTransport = this.device.createSendTransport(response);
                    
                    // connect
                    this.producerTransport.on('connect', ({dtlsParameters}, callback, errback) => {
                        this.socket.emit('connectWebRtcTransport', {
                            roomId: this.roomId,
                            transportId: this.producerTransport.id,
                            dtlsParameters
                        },
                        (response) =>  {
                            if(response.error) {
                                errback(new Error(response.error));
                                return;
                            }

                            callback();
                        })
                    })

                    // produce
                    this.producerTransport.on('produce', ({kind, rtpParameters, appData}, callback, errback) => {
                        this.socket.emit('produce', {
                            roomId: this.roomId,
                            transportId: this.producerTransport.id,
                            kind,
                            rtpParameters,
                            appData
                        }, (response) => {
                            if(response.error){
                                errback(new Error(response.error));
                                return;
                            }

                            callback({ id: response.id });
                        })
                    });

                    resolve();
                }
                catch(err){
                    reject(err);
                }
            });
        })
    }

    async createReceiveTransport() {
        return new Promise((resolve, reject) => {
            this.socket.emit('createWebRtctransport', {roomId: this.roomId}, async (response) => {
                if(response.error){
                    return reject(new Error(response.error));
                }

                try{
                    this.consumerTransport = this.device.createRecvTransport(response);

                    this.consumerTransport.on('connect', ({dtlsParameters}, callback, errback) => {
                        this.socket.emit('connectWebRtcTransport', {
                            roomId: this.roomId,
                            transportId: this.consumerTransport.id,
                            dtlsParameters
                        }, (response) => {
                            if(response.error){
                                errback(new Error(response.error));
                                return;
                            }

                            callback();
                        });
                    });

                    resolve();
                }
                catch(error){
                    reject(error);
                }
            })
        })
    }

    async getExistingProducers() {

    }

    async connectConsumer(peerId, producerId, kind){

    }
}