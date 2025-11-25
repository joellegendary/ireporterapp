import { pool } from "../config/db.js";

function safeParse(value) {
    try {
        return JSON.parse(value);
    } catch {
        return value; // return original if not JSON
    }
}

// =================== CREATE REPORT ===================
export const createReport = async (req, res) => {
    try {
        const {
            title,
            type,
            comment,
            location,
            images = [],
            videos = [],
            createdBy
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO reports (title, type, comment, location, images, videos, createdBy)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                type,
                comment,
                location,
                JSON.stringify(images),
                JSON.stringify(videos),
                createdBy
            ]
        );

        return res.status(201).json({
            success: true,
            data: { id: result.insertId },
        });

    } catch (err) {
        console.error("Error creating report:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// =================== GET ALL REPORTS ===================
export const getAllReports = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM reports ORDER BY createdOn DESC`
        );

        rows.forEach((r) => {
            r.images = safeParse(r.images || "[]");
            r.videos = safeParse(r.videos || "[]");
        });

        res.json({ success: true, data: rows });

    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// =================== GET SINGLE REPORT ===================
export const getReportById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT * FROM reports WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: "Report not found" });
        }

        const report = rows[0];
        report.images = safeParse(report.images || "[]");
        report.videos = safeParse(report.videos || "[]");

        res.json({ success: true, data: report });

    } catch (err) {
        console.error("Error fetching report:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// =================== UPDATE REPORT ===================
export const updateReport = async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body };

    try {
        if (updates.images) updates.images = JSON.stringify(updates.images);
        if (updates.videos) updates.videos = JSON.stringify(updates.videos);

        const updateFields = Object.keys(updates)
            .map((key) => `${key} = ?`)
            .join(", ");

        const values = Object.values(updates);

        await pool.query(
            `UPDATE reports SET ${updateFields} WHERE id = ?`,
            [...values, id]
        );

        res.json({ success: true });

    } catch (err) {
        console.error("Error updating report:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// =================== DELETE REPORT ===================
export const deleteReport = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(`DELETE FROM reports WHERE id = ?`, [id]);
        res.json({ success: true });

    } catch (err) {
        console.error("Error deleting report:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};
