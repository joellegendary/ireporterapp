import jwt from "jsonwebtoken";
import { findUserByEmail } from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await findUserByEmail(decoded.email);
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Unauthorized" });
    }
};
