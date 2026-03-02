import { Router, Request, Response } from "express";
import { connectToDatabase } from "../db";
import { IAdmin } from "../models/Admin";
import { comparePasswords, generateAdminToken } from "../middleware/auth";

const router = Router();

// POST /api/admin/login - Admin login
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const { db } = await connectToDatabase();
        const admin = await db.collection<IAdmin>("admins").findOne({ email, isActive: true });

        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isValid = await comparePasswords(password, admin.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Update last login
        await db.collection("admins").updateOne(
            { _id: admin._id },
            { $set: { lastLogin: new Date() } }
        );

        const token = generateAdminToken({
            id: admin._id,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
        });

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                admin: {
                    id: admin._id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                    permissions: admin.permissions,
                },
            },
        });
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ success: false, message: "Login failed" });
    }
});

// GET /api/admin/me - Get current admin info (requires auth token)
router.get("/me", async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // Decode token (basic base64 decode — replace with JWT in production)
        const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

        const { db } = await connectToDatabase();
        const admin = await db.collection<IAdmin>("admins").findOne({ email: decoded.email, isActive: true });

        if (!admin) {
            return res.status(401).json({ success: false, message: "Admin not found" });
        }

        res.json({
            success: true,
            data: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                permissions: admin.permissions,
            },
        });
    } catch (error) {
        console.error("Error fetching admin info:", error);
        res.status(500).json({ success: false, message: "Failed to get admin info" });
    }
});

export default router;
