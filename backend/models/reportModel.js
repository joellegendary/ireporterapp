import { pool } from "../config/db.js";

// -------------------------
// GET ALL REPORTS
// -------------------------
export const getAllReports = async () => {
    const [rows] = await pool.query("SELECT * FROM reports ORDER BY id DESC");

    return rows.map(formatIncident);
};

// -------------------------
// GET REPORT BY ID
// -------------------------
export const getReportById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM reports WHERE id = ?",
        [id]
    );
    return rows[0] ? formatIncident(rows[0]) : null;
};

// -------------------------
// CREATE REPORT
// -------------------------
export const createReport = async (data) => {
    const {
        createdBy,
        type,
        title,
        comment,
        status = "draft",
        location,
        images = [],
        videos = []
    } = data;

    const [result] = await pool.query(
        `INSERT INTO reports 
        (createdBy, type, title, comment, status, location, images, videos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            createdBy,
            type,
            title,
            comment,
            status,
            location,
            JSON.stringify(images),
            JSON.stringify(videos)
        ]
    );

    return result.insertId;
};

// -------------------------
// UPDATE REPORT
// -------------------------
export const updateReport = async (id, updates) => {
    // convert arrays to JSON
    if (updates.images) updates.images = JSON.stringify(updates.images);
    if (updates.videos) updates.videos = JSON.stringify(updates.videos);

    const fields = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(", ");

    const values = Object.values(updates);

    const [result] = await pool.query(
        `UPDATE reports SET ${fields} WHERE id = ?`,
        [...values, id]
    );

    return result.affectedRows > 0;
};

// -------------------------
// DELETE REPORT
// -------------------------
export const deleteReport = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM reports WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
};

// -------------------------
// GET REPORTS BY USER
// -------------------------
export const getReportsByUser = async (userId) => {
    const [rows] = await pool.query(
        "SELECT * FROM reports WHERE createdBy = ? ORDER BY id DESC",
        [userId]
    );

    return rows.map(formatIncident);
};

// -------------------------
// UTIL: FORMAT INCIDENT
// Converts DB row → Frontend-friendly object
// -------------------------
const formatIncident = (row) => ({
    id: row.id,
    createdBy: row.createdBy,
    type: row.type,
    title: row.title,
    comment: row.comment,
    status: row.status,
    location: row.location,
    images: JSON.parse(row.images || "[]"),
    videos: JSON.parse(row.videos || "[]"),
    createdOn: row.createdOn,
    updatedOn: row.updatedOn
});
