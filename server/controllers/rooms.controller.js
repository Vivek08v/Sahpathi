import RoomsManager from "../mediasoup/RoomsManager.js"
import { Classroom } from "../models/classroom.model.js";

export const getAllRooms = async(req, res) => {
    try{
        const roomsInMemory = RoomsManager.getRooms();
        const roomsInDB = await Classroom.find();

        // console.log(roomsInMemory);
        // console.log(roomsInDB);
        // const activeRooms = roomsInMemory.map((room, i) => (
        //     roomsInDB.find((r) => r.classId === room.id)
        // ))
        // console.log(activeRooms);
        
        const grouped = {};
        
        roomsInDB?.map(room => {
            if (!grouped[room.category]) {
                grouped[room.category] = [];
            }
            grouped[room.category].push(room);
        });
        
        // console.log(grouped);
        
        
        console.log("ghi")
        return res.status(200).json({
            success: true,
            // data: rooms,
            data: grouped,
            message: "API Success: Got all rooms..."
        })
    }
    catch(error){
        console.log('Error in getAllRooms: ', error);
        return res.status(500).json({
            success: false,
            message: "API Failed: Couldn't get Rooms"
        })
    }
}

export const createRoom = async(req, res) => {
    try{
        const {title, category, classtype, tags, createdBy} = req.body;  // issue in createdBy
        console.log(title, category, classtype, createdBy.id, createdBy.name)
        if(!title || !category || !classtype || !createdBy){
            return res.status(400).json({
                success: false,
                message: "API Failed: Missing data"
            })
        }
        const room = await RoomsManager.createRoom(title, createdBy.id);
        console.log("New Room created by ", createdBy.name, room.title);

        const roomStored = await Classroom.create({
            classId: room.id,
            classname: title,
            category,
            classtype,
            // tags,
            // createdBy,
            // schedule
        });
        console.log("New Room stored: ", roomStored);
        
        return res.status(200).json({
            success: true,
            data: roomStored,
            message: "API Success: Room Created"
        })
    }
    catch(error){
        console.log("error: ", error)
        return res.status(500).json({
            success: false,
            message: "API Failed: Room Not Created"
        })
    }
}