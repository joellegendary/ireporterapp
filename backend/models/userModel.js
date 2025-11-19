// backend/models/userModel.js
import e from "express";
import { pool } from "../config/db.js";

// Get all users
export const getAllUsers = async () => {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
};

// Create a new user
export const createUser = async (userData) => {
    const { firstname, lastname, othernames, email, phoneNumber, username, password, role } = userData;

    const [result] = await pool.query(
        `INSERT INTO users 
        (firstname, lastname, othernames, email, phoneNumber, username, password, role, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [firstname, lastname, othernames, email, phoneNumber, username, password, role || "user"]
    );

    return result.insertId;
};

// Get a user by ID
export const getUserById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
};

export const findUserByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
};

export const findUserByUsername = async (username) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0];
};