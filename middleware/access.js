import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"; // your Admin model

const authMiddleware = async (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        // 2. Verify + decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if user exists in DB by email (or id)
        const admin = await Admin.findOne({ email: decoded.email });
        if (!admin) {
            return res.status(401).json({ message: "User not found" });
        }

        // 4. Optional: Check if account is active
        if (!admin.status) {
            return res.status(403).json({ message: "Account deactivated" });
        }

        // 5. Attach full user data to req
        req.user = {
            id: admin._id,
            email: admin.email,
            role: admin.role,
            name: admin.name
        };

        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};

export default authMiddleware;
