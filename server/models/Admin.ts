import { ObjectId } from "mongodb";

export interface IAdmin {
  _id?: ObjectId;
  email: string;
  password: string; // In production, use bcrypt to hash passwords
  name: string;
  role: "super-admin" | "admin";
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export const AdminSchema = {
  bsonType: "object",
  required: [
    "email",
    "password",
    "name",
    "role",
    "permissions",
    "isActive",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    _id: { bsonType: "objectId" },
    email: { bsonType: "string" },
    password: { bsonType: "string" },
    name: { bsonType: "string" },
    role: { enum: ["super-admin", "admin"] },
    permissions: {
      bsonType: "array",
      items: { bsonType: "string" },
    },
    isActive: { bsonType: "bool" },
    createdAt: { bsonType: "date" },
    updatedAt: { bsonType: "date" },
    lastLogin: { bsonType: "date" },
  },
};
