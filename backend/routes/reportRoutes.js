import express from "express";
import { getAllReports, createReport } from "../controllers/reportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllReports);
router.post("/", authMiddleware, createReport);

export default router;
