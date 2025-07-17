import mediasoup from 'mediasoup';
import config from './config';

class Room {
    constructor(roomId, title, creatorId){
        this.id = roomId;
        this.title = title;
        this.creatorId = creatorId;
        this.peers = new Map();
        // to be added
        // Handle Transport, producers, teacher etc
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
            // 
            isConnected: false
        });

       //

       return this.peers.get(peerId);
    }

    removePeer(peerId) {
        if(!this.peers.has(peerId)) return;

        const peer = this.peers.get(peerId);

        this.peers.delete(peerId);
        console.log("Peer: ", peerId, " left the room: ", this.title);
    }
}