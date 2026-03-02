import { ObjectId } from "mongodb";

export interface IOrder {
  _id?: ObjectId;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  paymentMethod: "UPI" | "Card" | "NetBanking";
  paymentApproved: boolean;
  transactionId?: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const OrderSchema = {
  bsonType: "object",
  required: [
    "userId",
    "items",
    "total",
    "status",
    "paymentMethod",
    "paymentApproved",
    "customerDetails",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    _id: { bsonType: "objectId" },
    userId: { bsonType: "string" },
    items: {
      bsonType: "array",
      items: {
        bsonType: "object",
        properties: {
          id: { bsonType: "string" },
          name: { bsonType: "string" },
          price: { bsonType: "double" },
          quantity: { bsonType: "int" },
        },
      },
    },
    total: { bsonType: "double" },
    status: {
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
    },
    paymentMethod: { enum: ["UPI", "Card", "NetBanking"] },
    paymentApproved: { bsonType: "bool" },
    transactionId: { bsonType: "string" },
    customerDetails: {
      bsonType: "object",
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        phone: { bsonType: "string" },
        address: { bsonType: "string" },
      },
    },
    createdAt: { bsonType: "date" },
    updatedAt: { bsonType: "date" },
  },
};
