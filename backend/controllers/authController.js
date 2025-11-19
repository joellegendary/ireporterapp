import { createUser, findUserByEmail } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { firstname, lastname, othernames, email, phoneNumber, username, password } = req.body;

        // Check if user exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await createUser({
            firstname,
            lastname,
            othernames,
            email,
            phoneNumber,
            username,
            password: hashedPassword,
            role: "user",
            isActive: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getProfileController = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
