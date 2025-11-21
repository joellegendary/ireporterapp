import { pool } from "../config/db.js"; // your MySQL pool

const parseArrayField = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
        return JSON.parse(val);
    } catch (e) {
        // comma-separated fallback
        return String(val).split(",").map((s) => s.trim()).filter(Boolean);
    }
};

export const createReport = async (req, res) => {
    try {
        // Coerce fields safely (multipart/form-data will make them strings)
        const type = req.body.type;
        const title = req.body.title;
        const location = req.body.location;
        const comment = req.body.comment;
        const status = req.body.status;

        // createdBy may arrive as a string; coerce to number
        const createdBy = Number(req.body.createdBy || req.body.created_by || 0);
        if (!createdBy || Number.isNaN(createdBy)) {
            return res.status(400).json({ message: "Invalid creator ID" });
        }

        // images/videos: prefer uploaded files, otherwise parse body
        let images = [];
        let videos = [];
        if (req.files && req.files.length) {
            // keep uploaded filenames
            images = req.files.map((f) => f.filename);
        } else {
            images = parseArrayField(req.body.images);
            videos = parseArrayField(req.body.videos);
        }

        const sql = `
      INSERT INTO reports (type, title, location, comment, images, videos, createdBy, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const values = [
            type,
            title,
            location,
            comment,
            JSON.stringify(images || []),
            JSON.stringify(videos || []),
            createdBy,
            status || "draft",
        ];

        const [result] = await pool.execute(sql, values);
        res.status(200).json({ id: result.insertId });
    } catch (err) {
        console.error("Create report error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateReport = async (req, res) => {
    try {
        const reportId = Number(req.params.id);
        if (!reportId || Number.isNaN(reportId)) {
            return res.status(400).json({ message: "Invalid report id" });
        }

        const type = req.body.type;
        const title = req.body.title;
        const location = req.body.location;
        const comment = req.body.comment;

        let images = parseArrayField(req.body.images);
        let videos = parseArrayField(req.body.videos);
        if (req.files && req.files.length) {
            // if files uploaded, append their filenames to images
            const uploaded = req.files.map((f) => f.filename);
            images = images.concat(uploaded);
        }

        const sql = `
      UPDATE reports
      SET type=?, title=?, location=?, comment=?, images=?, videos=?
      WHERE id=?
    `;
        const values = [
            type,
            title,
            location,
            comment,
            JSON.stringify(images || []),
            JSON.stringify(videos || []),
            reportId,
        ];

        const [result] = await pool.execute(sql, values);
        res.status(200).json({ success: result.affectedRows > 0 });
    } catch (err) {
        console.error("Update report error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const [rows] = await pool.execute(`SELECT * FROM reports ORDER BY id DESC`);
        const reports = rows.map((r) => ({
            ...r,
            images: (() => { try { return JSON.parse(r.images || '[]'); } catch { return []; } })(),
            videos: (() => { try { return JSON.parse(r.videos || '[]'); } catch { return []; } })(),
        }));
        res.status(200).json(reports);
    } catch (err) {
        console.error('Get all reports error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getReportById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        const [rows] = await pool.execute(`SELECT * FROM reports WHERE id=? LIMIT 1`, [id]);
        if (!rows || rows.length === 0) return res.status(404).json({ message: 'Not found' });
        const r = rows[0];
        r.images = (() => { try { return JSON.parse(r.images || '[]'); } catch { return []; } })();
        r.videos = (() => { try { return JSON.parse(r.videos || '[]'); } catch { return []; } })();
        res.status(200).json(r);
    } catch (err) {
        console.error('Get report by id error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });
        const [result] = await pool.execute(`DELETE FROM reports WHERE id=?`, [id]);
        res.status(200).json({ success: result.affectedRows > 0 });
    } catch (err) {
        console.error('Delete report error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
