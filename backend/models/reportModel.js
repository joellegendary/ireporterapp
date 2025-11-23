import { pool } from "../config/db.js";

// Get all reports
export const getAllReports = async () => {
    const [rows] = await pool.query("SELECT * FROM reports ORDER BY id DESC");
    return rows;
};

// Get report by id
export const getReportById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM reports WHERE id = ?", [id]);
    return rows[0];
};

// Create report
export const createReport = async (data) => {
    const { title, description, type, location, imageUrl, createdBy } = data;

    const [result] = await pool.query(
        `INSERT INTO reports (title, description, type, location, imageUrl, createdBy)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, type, location, imageUrl, createdBy]
    );

    return result.insertId;
};

// Update report
export const updateReport = async (id, updates) => {
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

// Delete report
export const deleteReport = async (id) => {
    const [result] = await pool.query("DELETE FROM reports WHERE id = ?", [id]);
    return result.affectedRows > 0;
};

// Get reports for a user
export const getReportsByUser = async (userId) => {
    const [rows] = await pool.query(
        "SELECT * FROM reports WHERE createdBy = ? ORDER BY id DESC",
        [userId]
    );
    return rows;
};
