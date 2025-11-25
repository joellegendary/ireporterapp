// backend/models/userModel.js
import { pool } from "../config/db.js";

// =====================
// GET USER BY EMAIL
// Export both names so all files work
// =====================
export const findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email]
    );
    return rows[0];
};
export const getUserByEmail = findUserByEmail;  // alias


// =====================
// GET USER BY ID
// Export both names
// =====================
export const findUserById = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE id = ? LIMIT 1",
        [id]
    );
    return rows[0];
};
export const getUserById = findUserById;  // alias


// =====================
// CREATE USER
// =====================
export const createUser = async (userData) => {
    const {
        firstname,
        lastname,
        othernames,
        email,
        phone,
        username,
        password,
        role,
    } = userData;

    const [result] = await pool.query(
        `INSERT INTO users 
         (firstname, lastname, othernames, email, phoneNumber, username, password, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            firstname,
            lastname,
            othernames || "",
            email,
            phone,
            username,
            password,
            role || "user",
        ]
    );

    return { id: result.insertId, ...userData };
};
