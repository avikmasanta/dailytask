import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/server/db";
import { verifyAdminToken } from "@/server/middleware/auth";
import { sendApprovalEmail } from "@/lib/mailer";

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Verify admin token
    const token = request.headers.get("authorization")?.split(" ")[1];
    const admin = await verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = (await params).orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Update order status
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentApproved: true,
          status: "Processing",
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get updated order
    const updatedOrder = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(orderId) });

    // Send approval email to customer
    if (updatedOrder?.email) {
      try {
        await sendApprovalEmail(
          updatedOrder.email,
          orderId,
          updatedOrder.customerName || updatedOrder.name
        );
      } catch (emailErr) {
        console.error("Failed to send approval email:", emailErr);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment approved successfully",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Approve payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Verify admin token
    const token = request.headers.get("authorization")?.split(" ")[1];
    const admin = await verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = (await params).orderId;

    const { db } = await connectToDatabase();

    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
