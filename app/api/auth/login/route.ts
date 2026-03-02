import { NextResponse } from "next/server";
import { connectToDatabase } from "@/server/db";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const sanitizedEmail = email.trim().toLowerCase();

        const { db } = await connectToDatabase();

        // Find user by email and matching password
        // (Note: ignoring hashing for parity with existing mockUsers implementation)
        const user = await db.collection("users").findOne({
            email: sanitizedEmail,
            password: password
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Strip out password and mongoid before sending back
        const { password: _, _id, ...userWithoutPassword } = user as any;

        return NextResponse.json(
            {
                success: true,
                user: userWithoutPassword,
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
