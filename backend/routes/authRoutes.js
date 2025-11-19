import express from "express";
import { registerController, loginController, getProfileController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerController);
router.post("/login", loginController);
router.get("/profile", authMiddleware, getProfileController);

export default router;
