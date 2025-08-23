import RoomsManager from "../mediasoup/RoomsManager.js"

export const getAllRooms = (req, res) => {
    try{
        const rooms = RoomsManager.getRooms();
        return res.status(200).json({
            success: true,
            data: rooms,
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
        const {title, creatorId, creatorName} = req.body;
        console.log(title, creatorId, creatorName)
        if(!title || !creatorId || !creatorName){
            return res.status(400).json({
                success: false,
                message: "API Failed: Missing data"
            })
        }
        const room = await RoomsManager.createRoom(title, creatorId);
        console.log("New Room created by ", creatorName, room.title);
        
        // console.log("qw")
        return res.status(200).json({
            success: true,
            data: room.toJSON(),
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