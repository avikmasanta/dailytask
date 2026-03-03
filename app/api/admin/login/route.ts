import { NextResponse } from "next/server";
import { connectToDatabase } from "@/server/db";
import { comparePasswords, generateAdminToken } from "@/server/middleware/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Ensure at least one admin exists (auto-provision for demo/first run)
    const adminCount = await db.collection("admins").countDocuments();
    if (adminCount === 0) {
      console.log("🔐 Creating default admin users in Next.js API...");
      await db.collection("admins").insertMany([
        {
          email: "admin@plannermarket.com",
          password: "admin123",
          name: "Admin",
          role: "super-admin",
          permissions: ["view_orders", "approve_payments", "update_order_status", "manage_admins"],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "admin@plannercraft.me",
          password: "admin123",
          name: "Ayush Admin",
          role: "super-admin",
          permissions: ["view_orders", "approve_payments", "update_order_status", "manage_admins"],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]);
    }

    // Find admin by email
    const admin = await db.collection("admins").findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    await db.collection("admins").updateOne(
      { _id: admin._id },
      {
        $set: { lastLogin: new Date() },
      }
    );

    // Generate token
    const token = generateAdminToken({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        admin: {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
