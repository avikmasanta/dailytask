import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/server/db"
import { sendApprovalEmail } from "@/server/mail"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const updates = await req.json()
  const { db } = await connectToDatabase()

  const updateFields: any = {}
  if (updates.status) updateFields.status = updates.status
  if (typeof updates.paymentApproved === "boolean") {
    updateFields.paymentApproved = updates.paymentApproved
  }

  const { value } = await db.collection("orders").findOneAndUpdate(
    { id },
    { $set: updateFields },
    { returnDocument: "after" }
  )

  // log status change or approval
  await db.collection("orderLogs").insertOne({
    orderId: id,
    action: updates.paymentApproved === true ? "paymentApproved" : "statusUpdated",
    newValues: updateFields,
    timestamp: new Date(),
  })

  if (updates.paymentApproved === true && value?.customerEmail) {
    sendApprovalEmail(value.customerEmail, value.id).catch(console.error)
  }

  return NextResponse.json(value)
}
