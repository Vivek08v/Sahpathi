import e from "express";
const router = e.Router();
import { login, signUp, refreshAccessToken, logout } from "../controllers/auth.controller.js";
import { authN } from "../middlewares/auth.middleware.js";
import { upload } from "../utlis/multer.js";

router.post("/login", login);
router.post("/signup", upload.single("image"), signUp);
router.post("/refresh", refreshAccessToken);
router.get("/logout", authN, logout)

export default router;