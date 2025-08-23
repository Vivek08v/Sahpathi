import e from "express";
const router = e.Router();
import { getAllRooms, createRoom } from "../controllers/roomsController.js"

router.get("/get-all-rooms", getAllRooms);
router.post("/create-room", createRoom);

export default router;