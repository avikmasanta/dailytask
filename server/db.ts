import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    console.log("✓ Using cached MongoDB connection");
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("❌ Please define the MONGODB_URI environment variable");
  }

  const dbName = process.env.MONGODB_DB || "upi_payment_system";

  try {
    console.log("🔄 Connecting to MongoDB...");
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    // Test connection
    await db.admin().ping();

    cachedClient = client;
    cachedDb = db;

    console.log(`✓ Connected to MongoDB database: ${dbName}`);
    return { client, db };
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

export async function initializeDatabases() {
  const { db } = await connectToDatabase();

  try {
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (!collectionNames.includes("orders")) {
      console.log("📦 Creating 'orders' collection...");
      await db.createCollection("orders");
      await db.collection("orders").createIndex({ userId: 1 });
      await db.collection("orders").createIndex({ status: 1 });
      await db.collection("orders").createIndex({ createdAt: -1 });
      console.log("✓ 'orders' collection created with indexes");
    }

    if (!collectionNames.includes("admins")) {
      console.log("👤 Creating 'admins' collection...");
      await db.createCollection("admins");
      await db.collection("admins").createIndex({ email: 1 }, { unique: true });
      console.log("✓ 'admins' collection created with indexes");

      // Create default admin
      const adminExists = await db.collection("admins").findOne({
        email: "admin@plannermarket.com",
      });

      if (!adminExists) {
        console.log("🔐 Creating default admin user...");
        await db.collection("admins").insertOne({
          email: "admin@plannermarket.com",
          password: "admin123", // In production, this should be hashed
          name: "Admin",
          role: "super-admin",
          permissions: [
            "view_orders",
            "approve_payments",
            "update_order_status",
            "manage_admins",
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log("✓ Default admin user created");
      }
    }

    if (!collectionNames.includes("payments")) {
      console.log("💳 Creating 'payments' collection...");
      await db.createCollection("payments");
      await db.collection("payments").createIndex({ orderId: 1 });
      await db.collection("payments").createIndex({ status: 1 });
      console.log("✓ 'payments' collection created with indexes");
    }
  } catch (error) {
    console.error("❌ Error initializing databases:", error);
    throw error;
  }
}

export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("✓ MongoDB connection closed");
  }
}
