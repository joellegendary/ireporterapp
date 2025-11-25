// backend/routes/authRoutes.js
import express from "express";
import { login, signup } from "../controllers/authController.js";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/admin-test", authMiddleware, adminOnly, (req, res) => {
    res.json({ message: "You are an admin" });
});

export default router;
