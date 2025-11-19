import { pool } from "../config/db.js";

export const getAllReports = async (req, res) => {
    try {
        let query = `SELECT * FROM incidents`;
        let params = [];

        // If not admin, filter by user
        if (req.user.role !== "admin") {
            query += " WHERE createdById = ?";
            params.push(req.user.id);
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const createReport = async (req, res) => {
    try {
        const { type, title, comment, location, coordinates, images, videos } = req.body;
        const now = new Date();

        const [result] = await pool.query(
            `INSERT INTO incidents 
        (type, title, comment, location, coordinates, images, videos, status, createdAt, updatedAt, createdById)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
            [type, title, comment, location, coordinates, JSON.stringify(images), JSON.stringify(videos), now, now, req.user.id]
        );

        res.status(201).json({ id: result.insertId, type, title, comment, location, coordinates, images, videos, status: "pending", createdAt: now, updatedAt: now, createdById: req.user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
export const getReportById = async (req, res) => {
    try {
        const reportId = req.params.id;
        const [rows] = await pool.query(`SELECT * FROM incidents WHERE id = ?`, [reportId]);
        const report = rows[0];
        if (!report) return res.status(404).json({ message: "Report not found" });
        // If not admin, ensure the user owns the report
        if (req.user.role !== "admin" && report.createdById !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};