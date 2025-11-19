import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { getAllUsers, createUser } from "./models/userModel.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // <-- Replaces bodyParser.json()
app.use(express.urlencoded({ extended: true })); // <-- Handles form data

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// Get all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Create a user
app.post("/api/users", async (req, res) => {
    try {
        const id = await createUser(req.body);
        res.status(201).json({ id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
