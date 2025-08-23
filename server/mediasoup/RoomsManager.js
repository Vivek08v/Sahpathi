import { v4 as uuidv4} from 'uuid';
import Room from './Rooms.js';

class RoomsManager {
    constructor() {
        this.rooms = new Map();
    }

    async createRoom(title, creatorId) {
        const roomId = uuidv4();
        const room = new Room(roomId, title, creatorId);
        await room.init();
        this.rooms.set(roomId, room);
        return room;
    }

    getRoom(roomId){
        return this.rooms.get(roomId);
    }

    getRooms(){
        return Array.from(this.rooms.values()).map(room => room.toJSON());
    }

    removeRoom(roomId) {
        const room = this.rooms.get(roomId);
        if(room){
            if(room.worker) {
                room.worker.close();
            }
            this.rooms.delete(roomId);
            return true;
        }
        return false;
    }

    cleanUpRooms() {
        for(const [roomId, room] of this.rooms.entries()){
            if(room.isRoomEmpty()){
                this.removeRoom(roomId);
            }
        }
    }
}

export default new RoomsManager();