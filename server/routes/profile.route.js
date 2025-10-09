import e from "express";
import { followOrUnfollowAFriendRequest } from "../controllers/userProfile.controller.js";
import { authN } from "../middlewares/auth.middleware.js";

const router = e.Router();
router.patch("/follow-or-unfollow-request", authN, followOrUnfollowAFriendRequest);

export default router;