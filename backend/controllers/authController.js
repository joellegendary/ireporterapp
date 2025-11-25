// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    findUserByEmail,
    createUser,
    getUserById
} from "../models/userModel.js";

// =====================
// SIGNUP
// =====================
export const signup = async (req, res) => {
    try {
        const { firstname, lastname, othernames, email, phone, username, password } = req.body;

        // check if user exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = await createUser({
            firstname,
            lastname,
            othernames,
            email,
            phone,
            username,
            password: hashedPassword,
            role: "user"
        });

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            user: newUser
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// =====================
// LOGIN
// =====================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user by email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // generate token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
