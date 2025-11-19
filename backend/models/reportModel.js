import { pool } from "../config/db.js";

export const createReport = async (title, description, userId, filePath = null) => {
    const [result] = await pool.query(
        "INSERT INTO reports (title, description, user_id, file_path, created_at) VALUES (?, ?, ?, ?, NOW())",
        [title, description, userId, filePath]
    );
    return result;
};

export const getAllReports = async ({ search = "", userId, startDate, endDate }) => {
    let query = "SELECT * FROM reports WHERE 1=1";
    const params = [];

    if (search) {
        query += " AND (title LIKE ? OR description LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }
    if (userId) {
        query += " AND user_id = ?";
        params.push(userId);
    }
    if (startDate) {
        query += " AND created_at >= ?";
        params.push(startDate);
    }
    if (endDate) {
        query += " AND created_at <= ?";
        params.push(endDate);
    }

    const [rows] = await pool.query(query, params);
    return rows;
};

export const getReportById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM reports WHERE id = ?", [id]);
    return rows[0];
};

export const updateReport = async (id, title, description, filePath = null) => {
    const [result] = await pool.query(
        "UPDATE reports SET title = ?, description = ?, file_path = ? WHERE id = ?",
        [title, description, filePath, id]
    );
    return result;
};

export const deleteReport = async (id) => {
    const [result] = await pool.query("DELETE FROM reports WHERE id = ?", [id]);
    return result;
};
