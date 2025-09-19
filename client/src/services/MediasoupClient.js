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
        this.onPeerJoined = null;
        this.onPeerClosed = null;
        this.chatPeers = new Map();   // chat peers
        this.onChatPeerJoined = null;
        this.onChatPeerClosed = null;
        this.onNewConsumer = null;
        this.onChatMessage = null;
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

        this.socket.on('newChatPeer', ({ peerId, name, role }) => {  // chat peers
            console.log("........................................")
            console.log("New chat peer joined: ", name, peerId, role);

            this.chatPeers.set(peerId, {id: peerId, name, role});

            if(this.onChatPeerJoined){
                this.onChatPeerJoined(peerId, name, role);
            }
        })

        this.socket.on('chatPeerClosed', ({ peerId }) => {   // chat peers
          console.log('Peer closed:', peerId);
          if (this.onChatPeerClosed) {
            this.onChatPeerClosed(peerId);
          }

          if (this.chatPeers.has(peerId)) {
            this.chatPeers.delete(peerId);
          }
        });

        this.socket.on('newPeer', ({ peerId, name, role }) => {
            console.log("New peer joined: ", name, peerId);

            this.peers.set(peerId, {id: peerId, name, role});

            if(this.onPeerJoined){
                this.onPeerJoined(peerId, name, role);
            }
        })

        this.socket.on('peerClosed', ({ peerId }) => {
          console.log('Peer closed:', peerId);
          if (this.onPeerClosed) {
            this.onPeerClosed(peerId);
          }

          if (this.peers.has(peerId)) {
            this.peers.delete(peerId);
          }
        });

        this.socket.on('newProducer', ({ peerId, producerId, kind }) => {
            console.log("New Producer: ", peerId, producerId ,kind);
            this.connectConsumer(peerId, producerId, kind);
        })

        this.socket.on('chatMessage', ({id, sender, text, timestamp}) => {  
          console.log('Chat message:', text);
          if (this.onChatMessage) {
            this.onChatMessage({text, sender, timestamp});
          }
        });

        //

        try {
            this.device = new mediasoupClient.Device();
        }
        catch(err){
            console.error('Could not create Mediasoup Device: ', err);
            throw err;
        }
    }

    async joinRoomPreview(roomId, displayName, role = 'student') {
        if(!this.isConnected) {
            throw new Error('Not connected to signaling server');
        }

        return new Promise((resolve, reject) => {
            this.socket.emit('joinRoomPreview', {roomId, name: displayName, role}, async (response) => {
                if(response.error) {
                    return reject(new Error(response.error));
                }

                this.roomId = roomId;
                this.displayName = displayName;
                this.role = role;
                
                const { roomData } = response;
                console.log("response:", roomData)

                roomData.chatPeers.forEach(peer => {
                    this.chatPeers.set(peer.id, peer);
                    this.onChatPeerJoined(peer.id, peer.name, peer.role)
                });

                resolve(roomData);
            })
        })
    }

    async leaveRoomPreview() {
        return new Promise((resolve) => {
            try {
                if (this.socket && this.roomId) {
                    console.log("call for leaving the room")
                    this.socket.emit('leaveRoomPreview', { roomId: this.roomId }, () => {
                        this.roomId = null;
                        this.chatPeers.clear();
                        resolve();
                    });
                } else {
                    this.roomId = null;
                    this.chatPeers.clear();
                    resolve();
                }
            } catch (e) {
                this.roomId = null;
                this.chatPeers.clear();
                resolve();
            }
        })
    }

    async joinRoom(roomId, displayName, role = 'student') {
        if(!this.isConnected) {
            throw new Error('Not connected to signaling server');
        }

        return new Promise((resolve, reject) => {
            this.socket.emit('joinRoom', {roomId, name: displayName, role}, async (response) => {
                if(response.error) {
                    // console.log("error in Mediasoupclient.js0")
                    return reject(new Error(response.error));
                }
                console.log("error in Mediasoupclient.js1")

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

    async leaveRoom() {
        return new Promise((resolve) => {
            try {
                if (this.socket && this.roomId) {
                    this.socket.emit('leaveRoom', { roomId: this.roomId }, () => {
                        // perform local cleanup after server acknowledges
                        this.closeAllProducers();
                        this.closeAllConsumers();
                        if (this.producerTransport) {
                            this.producerTransport.close();
                            this.producerTransport = null;
                        }
                        if (this.consumerTransport) {
                            this.consumerTransport.close();
                            this.consumerTransport = null;
                        }
                        this.roomId = null;
                        this.peers.clear();
                        resolve();
                    });
                } else {
                    // no active room, just cleanup locally
                    this.closeAllProducers();
                    this.closeAllConsumers();
                    if (this.producerTransport) {
                        this.producerTransport.close();
                        this.producerTransport = null;
                    }
                    if (this.consumerTransport) {
                        this.consumerTransport.close();
                        this.consumerTransport = null;
                    }
                    this.roomId = null;
                    this.peers.clear();
                    resolve();
                }
            } catch (e) {
                // fallback cleanup
                this.closeAllProducers();
                this.closeAllConsumers();
                this.roomId = null;
                this.peers.clear();
                resolve();
            }
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
            this.socket.emit('createWebRtcTransport', {roomId: this.roomId}, async (response) => {
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

    async publish(track, appData = {}){
        if(!this.producerTransport){
            throw new Error('Send transport not created');
        }
        
        try {
            console.log(3, track, appData)
            const producer = await this.producerTransport.produce({track, appData});
            console.log(4)
            this.producers.set(producer.id, producer);
            
            producer.on('trackended', () => {
                console.log('track ended');
                // this.closeProducer(producer.id);
            });

            return producer;
        }
        catch(err){
            console.error('Error producing: ', err);
            throw err;
        }
    }

    async getExistingProducers() {
        return new Promise((resolve, reject) => {
            this.socket.emit('getProducers', { roomId: this.roomId }, async(response) => {
                console.log("get All producers: ", response.producers);

                if(response.error){
                    return reject(new Error(response.error));
                }

                try{
                    const {producers} = response;
                    for(const {peerId, producerId, kind} of producers) {
                        console.log("connecting to producer: ", peerId, producerId, kind);
                        await this.connectConsumer(peerId, producerId, kind);
                    }
                    resolve();
                }
                catch(error){
                    console.error('error while getting allProducers: ', error);
                    reject(error);
                }
            })
        })
    }

    async connectConsumer(peerId, producerId, kind){
        if(!this.consumerTransport) {
            throw new Error('Receive transport not created');
        }

        console.log("connect consumer called for: ", this.peerId, " to connect with ", peerId, kind);
        if(peerId === this.peerId){
            return;
        }

        return new Promise((resolve, reject) => {
            this.socket.emit('consume', {
                roomId: this.roomId,
                transportId: this.consumerTransport.id,
                producerId,
                rtpCapabilities: this.device.rtpCapabilities
            }, async(response) => {
                if(response.error) {
                    return reject(new Error(response.error));
                }

                try{
                    const consumer = await this.consumerTransport.consume({
                        id: response.id,
                        producerId: response.producerId,
                        kind: response.kind,
                        rtpParameters: response.rtpParameters
                    });

                    this.consumers.set(consumer.id, consumer);

                    this.socket.emit('resumeConsumer', {
                        roomId: this.roomId,
                        consumerId: consumer.id
                    })

                    if(this.onNewConsumer){
                        this.onNewConsumer({  // callback function called
                            consumer,
                            peerId,
                            kind
                        }) 
                    }

                    resolve(consumer);
                }
                catch(err){
                    console.log("Error occured while consuming")
                    reject(err);
                }
            })
        })
    }

    closeProducer(producerId){

    }
    
    // (duplicate removed; leaveRoom implemented above)

    closeAllProducers() {
        for (const producer of this.producers.values()) {
            producer.close();
        }
        this.producers.clear();
    }

    closeAllConsumers() {
        for (const consumer of this.consumers.values()) {
            consumer.close();
        }
        this.consumers.clear();
    }

    sendChatMessage(message) {
        if (!this.roomId) {
          throw new Error('No roomId, Not in a room');
        }

        console.log(message)
        
        this.socket.emit('chatMessage', {
          roomId: this.roomId,
          message,
          sender: {
            id: this.peerId,
            name: this.displayName,
            role: this.role
          }
        });
    }
}

export default new MediasoupClient();