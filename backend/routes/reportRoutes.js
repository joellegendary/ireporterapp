import express from "express";
import {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/", createReport);
router.get("/", getAllReports);
router.get("/:id", getReportById);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

export default router;
