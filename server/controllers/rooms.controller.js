import RoomsManager from "../mediasoup/RoomsManager.js"
import { Classroom } from "../models/classroom.model.js";

export const getAllRooms = async(req, res) => {
    try{
        const roomsInDB = await Classroom.find().populate('participants.user');
        // const roomsInMemory = RoomsManager.getRooms();
        // console.log(roomsInDB);

        const allRoomsIncMine = {
            myRooms: {
                Searching: [], 
                Scheduled: [],
                Ongoing: [],
                Completed: [],
                Cancelled: [],
            },
            allRooms: {
                Searching: [], 
                Scheduled: [],
                Ongoing: [],
                Completed: [],
                Cancelled: [],
            },
        }

        roomsInDB.forEach((room) => {
            allRoomsIncMine.allRooms[room.status].push(room);
            if(room.participants.some(p => String(p.user._id) === String(req.user.id))){
                allRoomsIncMine.myRooms[room.status].push(room);
            }
        })

        Object.keys(allRoomsIncMine).forEach((roomType) => {
            Object.keys(allRoomsIncMine[roomType]).forEach((roomStatus) => {
                allRoomsIncMine[roomType][roomStatus].reverse();
            })
        })

        // console.log(allRoomsIncMine);
        
        return res.status(200).json({
            success: true,
            data: allRoomsIncMine,
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

export const getRoom = async(req, res) => {
    try{
        const { id } = req.params;
        console.log("hii1");
        const roomsInMemory = RoomsManager.getRooms();
        console.log(id);
        console.log(roomsInMemory);
        const room = roomsInMemory.filter((room) => room.id === id);
        
        console.log("hii3");
        console.log(room);
        if(room && room.length===0){
            return res.status(200).json({
                success: false,
                message: "API Failed: Room Not Found"
            })
        }
        
        return res.status(200).json({
            success: true,
            data: room[0],
            message: "API Success: Got the room..."
        })
    }
    catch(error){
        console.log('Error in getAllRooms: ', error);
        return res.status(500).json({
            success: false,
            message: "API Failed: Couldn't get Room"
        })
    }
}

export const createRoom = async(req, res) => {
    try{
        const {title, category, classtype, tags, user} = req.body;  // issue in createdBy
        console.log(title, category, classtype, user, tags);
        if(!title || !category || !classtype || !user){
            return res.status(400).json({
                success: false,
                message: "API Failed: Missing data"
            })
        }
        const room = await RoomsManager.createRoom(title, user._id);
        console.log("New Room created by ", user.name, room.title);

        const roomStored = await Classroom.create({
            classId: room.id,
            classname: title,
            category,
            classtype,
            tags: tags.split(' '),
            createdBy: user,
            participants: {user, role: "Learner"}
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