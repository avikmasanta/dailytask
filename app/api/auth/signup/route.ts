import { NextResponse } from "next/server";
import { connectToDatabase } from "@/server/db";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedName = name.trim();

        const { db } = await connectToDatabase();

        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ email: sanitizedEmail });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Insert new user
        const newUser = {
            id: `user-${Date.now()}`,
            name: sanitizedName,
            email: sanitizedEmail,
            role: "user",
            password, // In a real app, this should be hashed, but keeping it plain for parity with existing logic
            createdAt: new Date(),
        };

        await db.collection("users").insertOne(newUser);

        // Return user without password
        const { password: _, _id, ...userWithoutPassword } = newUser as any;

        return NextResponse.json(
            {
                success: true,
                user: userWithoutPassword,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
