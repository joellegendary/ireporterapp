import express from "express";
import path from "path";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createReport, getAllReports, getReportById, updateReport, deleteReport } from "../controllers/reportController.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

// Routes
router.get("/", authMiddleware, getAllReports);
router.get("/:id", authMiddleware, getReportById);
router.post("/", authMiddleware, upload.array("files", 10), createReport);
router.put("/:id", authMiddleware, upload.array("files", 10), updateReport);
router.delete("/:id", authMiddleware, deleteReport);

export default router;
