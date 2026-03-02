import { NextResponse } from "next/server";
import { connectToDatabase } from "@/server/db";
import { verifyAdminToken } from "@/server/middleware/auth";

export async function GET(request: Request) {
  try {
    // Verify admin token from headers
    const token = request.headers.get("authorization")?.split(" ")[1];

    const admin = await verifyAdminToken(token);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Get pending UPI orders
    const pendingOrders = await db
      .collection("orders")
      .find({
        paymentMethod: "UPI",
        paymentApproved: false,
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Get all orders with stats
    const allOrders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const stats = {
      totalOrders: allOrders.length,
      pendingApprovals: pendingOrders.length,
      processingOrders: allOrders.filter((o: any) => o.status === "Processing")
        .length,
      shippedOrders: allOrders.filter((o: any) => o.status === "Shipped").length,
      deliveredOrders: allOrders.filter((o: any) => o.status === "Delivered").length,
      totalRevenue: allOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0),
    };

    return NextResponse.json(
      {
        success: true,
        admin,
        stats,
        pendingOrders: pendingOrders,
        orders: allOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
