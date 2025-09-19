import { v4 as uuidv4} from 'uuid';
import Room from './Rooms.js';
import { Classroom } from '../models/classroom.model.js';

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
        // console.log("All rooms:")
        // Array.from(this.rooms.values()).map(room => console.log(room.id));
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

    async cleanUpRooms() {
        for(const [roomId, room] of this.rooms.entries()){
            console.log("Room Cleaning Up...", room)
            if(room.isRoomEmpty()){
                await Classroom.findOneAndUpdate({ classId: roomId}, {$set: {status: "Completed"}})
                this.removeRoom(roomId);
            }
        }
    }
}

export default new RoomsManager();