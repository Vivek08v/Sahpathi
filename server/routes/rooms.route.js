import e from "express";
const router = e.Router();
import { getRoom ,getAllRooms, createRoom } from "../controllers/rooms.controller.js"
import { authN } from "../middlewares/auth.middleware.js";

router.get("/get-room/:id", authN, getRoom);
router.get("/get-all-rooms", authN, getAllRooms);
router.post("/create-room", authN, createRoom);

export default router;