import mediasoup from 'mediasoup';
import config from './config';

class Room {
    constructor(roomId, title, creatorId){
        this.id = roomId;
        this.title = title;
        this.creatorId = creatorId;
        this.peers = new Map();
        this.transports = new Map();
        this.producers = new Map();
        this.consumers = new Map();
        this.teacher = null;
        this.isTeacherAssigned = false;
        this.router = null;
        this.mediaCodecs = config.mediasoup.router.mediaCodecs;
    }

    async init(){
        try{
            const worker = await mediasoup.createWorker({
                logLevel: config.mediasoup.worker.logLevel,
                logTags: config.mediasoup.worker.logTags,
                rtcMinPort: config.mediasoup.worker.rtcMinPort,
                rtcMaxPort: config.mediasoup.worker.rtcMaxPort
            })

            worker.on('died', ()=>{
                console.error('mediasoup worker died, exiting in 2 seconds... [room:%s]', this.id);
                setTimeout(()=> process.exit(1), 2000);
            });

            this.worker = worker;
            this.router = await worker.createRouter({ mediaCodecs: this.mediaCodecs });
            console.log('Room Created: ', this.id);

            return this.router;
        }
        catch(error){
            console.error('Error while creating room: ', error);
            throw error;
        }
    }

    addPeer(peerId, name, role){
        if(this.peers.has(peerId)){
            return this.peers.get(peerId);
        }

        this.peers.set(peerId, {
            id: peerId,
            name,
            role,
            transports: [],
            producers: [],
            consumers: [],
            isConnected: false
        });

        if(role === 'teacher' && !this.isTeacherAssigned){
            this.teacher = peerId;
            this.isTeacherAssigned = true;
        }

       return this.peers.get(peerId);
    }

    removePeer(peerId) {
        if(!this.peers.has(peerId)) return;

        const peer = this.peers.get(peerId);

        // Close transports
        peer.transports.forEach(transportId => {
            const transport = this.transports.get(transportId);
            if(transport) {
                transport.close();
                this.transports.delete(transportId);
            }
        })

        //Close producers
        peer.producers.forEach(producerId => {
            const producer = this.producers.get(producerId);
            if(producer){
                producer.close();
                this.producers.delete(producerId);
            }
        })

        // Close consumers
        peer.consumers.forEach(consumerId => {
            const consumer = this.consumers.get(consumerId);
            if(consumer){
                consumer.close();
                this.consumers.delete(consumerId);
            }
        })

        if(peer.id === this.teacher.id){
            this.teacher = null;
            this.isTeacherAssigned = false;
        }

        this.peers.delete(peerId);
        console.log("Peer: ", peerId, " left the room: ", this.title);
    }


    // Creating Transports
    async createWebRtcTransport(peerId) {
        try{
            const {maxIncomingBitrate, initialAvailableOutgoingBitrate, listenIps} = 
                config.mediasoup.webRtcTransport;

            const transport = await this.router.createWebRtcTransport({
                listenIps,
                enableUdp: true,
                enableTcp: true,
                preferUdp: true,
                initialAvailableOutgoingBitrate,
            });

            if(maxIncomingBitrate){
                try{
                    await transport.setMaxIncomingBitrate(maxIncomingBitrate);
                }
                catch(err){
                    console.error('error in setMaxIncomingBitrate: ', err);
                }
            }

            const transportId = transport.id;

            transport.appData = {
                ...transport.appData,
                peerId
            }

            this.transports.set(transportId, transport);

            const peer = this.peers.get(peerId);
            if(peer){
                peer.transports.push(transportId);
            }

            transport.on('dtlsstatechange', (dtlsState) => {
                if(dtlsState === 'closed') {
                    transport.close();
                    this.transports.delete(transportId);
                }
            });

            transport.on('close', ()=>{
                this.transports.delete(transportId);
            });

            return {
                id: transportId,
                iceParameters: transport.iceParameters,
                iceCandidates: transport.iceCandidates,
                dtlsParameters: transport.dtlsParameters
            };
        }
        catch(err){
            console.error("Error in createWebRtcTransport: ", err);
            throw err;
        }
    }

    // Connect Transport
    async connectWebRtcTransport(transportId, dtlsParameters){
        if(!this.transports.has(transportId)){
            throw new Error(`Transport with id ${transportId} not found`);
        }

        const transport = this.transports.get(transportId);
        await transport.connect({dtlsParameters});
        return true;
    }


    // Produce
    async produce(peerId, transportId, kind, rtpParameter, appData){
        if(!this.transports.has(transportId)){
            throw new Error(`Transport with id ${transportId} not found`);
        }

        const transport = this.transports.get(transportId);
        const producer = await transport.produce({
            kind,
            rtpParameter,
            appData: {
                ...appData,
                peerId
            }
        });

        const producerId = producer.id;
        this.producers.set(producerId, producer);

        const peer = this.peers.get(peerId);
        if(peer) {
            peer.producers.push(producerId);
        }

        producer.on('transportClose', () => {
            this.producers.delete(producerId);
        });

        console.log(`[Server] Registered producer: `, {
            peerId,
            producerId: producer.id,
            kind
        });

        return {id: producerId};
    }

    
    // Consume
    async consume(peerId, transportId, producerId, rtpCapabilities) {
        if(!this.transports.has(transportId)){
            throw new Error(`Transport with id ${transportId} not found`);
        }

        if(!this.producers.has(producerId)){
            throw new Error(`Producer with id ${producerId} not found`);
        }

        if(!this.router.canConsume({ producerId, rtpCapabilities })){
            throw new Error('Cannot consume this producer');
        }

        const transport = this.transports.get(transportId);
        const consumer = await transport.consume({
            producerId,
            rtpCapabilities,
            paused: true,
            appData: {peerId}
        });

        const consumerId = consumer.id;
        this.consumers.set(consumerId, consumer);

        const peer = this.peers.get(peerId);
        if(peer){
            peer.consumers.push(consumerId);
        }

        consumer.on('transportClose', () => {
            this.consumers.delete(consumerId);
        });

        consumer.on('producerClose', () => {
            this.consumers.delete(consumerId);
        });


        return {
            id: consumerId,
            producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            type: consumer.type,
            producerPaused: consumer.producerPaused
        };
    }

    async resumeConsumer(consumerId) {
        const consumer = this.consumers.get(consumerId);
        if(!consumer) throw new Error(`Consumer with id ${consumerId} not found`);
        await consumer.resume();
        return true;
    }

    getTransport(transportId) {
        return this.transports.get(transportId);
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            creatorId: this.creatorId,
            teacher: this.teacher,
            isTeacherAssigned: this.isTeacherAssigned,
            peers: Arrays.from(this.peers.values()).map(peer => ({
                id: peer.id,
                name: peer.name,
                role: peer.role
            })) 
        }
    }

    getPeers() {
        return Array.from(this.peers.values());
    }

    isRoomEmpty() {
        return this.peers.size === 0;
    }
}

module.exports = Room;