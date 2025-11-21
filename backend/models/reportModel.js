import { pool } from "../config/db.js";

// Create report
export const createReport = async (data) => {
    const { type, title, location, comment, images, videos, createdBy, status } = data;
    const [result] = await pool.query(
        "INSERT INTO reports (type, title, location, comment, images, videos, createdBy, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
            type,
            title,
            location,
            comment,
            JSON.stringify(images),
            JSON.stringify(videos),
            createdBy,
            status,
        ]
    );
    return result.insertId;
};

// Get all reports
export const getAllReports = async () => {
    const [rows] = await pool.query("SELECT * FROM reports");
    return rows;
};

// Get report by ID
export const getReportById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM reports WHERE id = ?", [id]);
    return rows[0];
};

// Update report
export const updateReport = async (id, data) => {
    const { type, title, location, comment, images, videos, status } = data;
    await pool.query(
        "UPDATE reports SET type=?, title=?, location=?, comment=?, images=?, videos=?, status=?, updatedAt=NOW() WHERE id=?",
        [
            type,
            title,
            location,
            comment,
            JSON.stringify(images),
            JSON.stringify(videos),
            status,
            id,
        ]
    );
    return await getReportById(id);
};

// Delete report
export const deleteReport = async (id) => {
    await pool.query("DELETE FROM reports WHERE id=?", [id]);
};
