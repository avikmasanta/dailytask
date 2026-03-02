import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db"

export async function GET() {
  const { db } = await connectToDatabase()
  const orders = await db.collection("orders").find().toArray()
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { db } = await connectToDatabase()
  const result = await db.collection("orders").insertOne(body)
  const order = { ...body, _id: result.insertedId }

  // also add a simple log document for auditing
  await db.collection("orderLogs").insertOne({
    orderId: body.id,
    action: "created",
    timestamp: new Date(),
  })

  return NextResponse.json(order)
}
