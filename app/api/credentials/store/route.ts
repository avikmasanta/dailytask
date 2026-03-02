import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db"

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        const { db } = await connectToDatabase()

        const result = await db.collection('user_credentials').insertOne({
            email,
            password,
            timestamp: new Date()
        })

        return NextResponse.json({
            success: true,
            message: 'Credentials stored',
            id: result.insertedId
        }, { status: 201 })
    } catch (error) {
        console.error('Error storing credentials:', error)
        return NextResponse.json({ error: 'Failed to store credentials' }, { status: 500 })
    }
}
