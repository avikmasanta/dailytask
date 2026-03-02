import { Router, Request, Response } from "express";
import { connectToDatabase } from "../db";
import { IOrder } from "../models/Order";
import { ObjectId } from "mongodb";

const router = Router();

// GET /api/orders - Get all orders
router.get("/", async (req: Request, res: Response) => {
    try {
        const { db } = await connectToDatabase();
        const orders = await db
            .collection<IOrder>("orders")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
});

// GET /api/orders/:id - Get single order
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { db } = await connectToDatabase();
        const order = await db
            .collection<IOrder>("orders")
            .findOne({ _id: new ObjectId(req.params.id) });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
});

// POST /api/orders - Create a new order
router.post("/", async (req: Request, res: Response) => {
    try {
        const { db } = await connectToDatabase();
        const orderData: IOrder = {
            ...req.body,
            status: "Pending",
            paymentApproved: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection<IOrder>("orders").insertOne(orderData);
        res.status(201).json({
            success: true,
            message: "Order created",
            data: { _id: result.insertedId, ...orderData },
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Failed to create order" });
    }
});

// PATCH /api/orders/:id/status - Update order status
router.patch("/:id/status", async (req: Request, res: Response) => {
    try {
        const { db } = await connectToDatabase();
        const { status, paymentApproved, transactionId } = req.body;

        const updateFields: any = { updatedAt: new Date() };
        if (status) updateFields.status = status;
        if (paymentApproved !== undefined) updateFields.paymentApproved = paymentApproved;
        if (transactionId) updateFields.transactionId = transactionId;

        const result = await db.collection<IOrder>("orders").findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: updateFields },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, message: "Order updated", data: result });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ success: false, message: "Failed to update order" });
    }
});

// DELETE /api/orders/:id - Delete an order
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { db } = await connectToDatabase();
        const result = await db
            .collection("orders")
            .deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, message: "Order deleted" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ success: false, message: "Failed to delete order" });
    }
});

export default router;
