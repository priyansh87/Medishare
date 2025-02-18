import express from "express";
import { registerUser, loginUser, logoutUser, getUserProfile } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware , logoutUser); 
router.get("/profile", authMiddleware, getUserProfile); // Protected route

export default router;
