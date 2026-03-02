import { connectToDatabase } from "./server/db";
import "dotenv/config";

async function testSignup() {
    try {
        console.log("🔍 Testing MongoDB connection...");
        const { db } = await connectToDatabase();
        console.log("✓ Connected to database:", db.databaseName);

        const testEmail = `test-${Date.now()}@example.com`;
        const newUser = {
            id: `test-user-${Date.now()}`,
            name: "Test User",
            email: testEmail,
            password: "password123",
            createdAt: new Date()
        };

        console.log(`📝 Attempting to insert test user: ${testEmail}`);
        const result = await db.collection("users").insertOne(newUser);
        console.log("✓ User inserted successfully. ID:", result.insertedId);

        console.log("🔍 Verifying user retrieval...");
        const foundUser = await db.collection("users").findOne({ email: testEmail });
        if (foundUser) {
            console.log("✓ User retrieved successfully:", foundUser.email);
        } else {
            console.error("❌ Failed to retrieve user after insertion.");
        }

        console.log("🗑️ Cleaning up test user...");
        await db.collection("users").deleteOne({ email: testEmail });
        console.log("✓ Test user deleted.");

    } catch (error) {
        console.error("❌ Database test failed:", error);
    } finally {
        process.exit();
    }
}

testSignup();
