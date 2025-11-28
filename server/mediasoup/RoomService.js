import { Classroom } from '../models/classroom.model.js';

class RoomService{
    async changeRoomStatusToOngoing(roomId){
        try{
            console.log("hello")
            const room = await Classroom.findOne({classId: roomId});
            console.log(room);

            room.status = "Ongoing";
            await room.save();
        }
        catch(error){
            console.log("error in room status update: ", error);
            throw new Error("error in room status update: ", error);
        }
    }

    async changeRoomStatusToCompleted(roomId){
        try{
            console.log("hello")
            const room = await Classroom.findOne({classId: roomId});
            console.log(room);

            room.status = "Completed";
            await room.save();
        }
        catch(error){
            console.log("error in room status update: ", error);
            throw new Error("error in room status update: ", error);
        }
    }
}

export default new RoomService();