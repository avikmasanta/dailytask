import "dotenv/config"; // ← MUST be first: loads .env before anything else

import express from "express";
import cors from "cors";
import { connectToDatabase, initializeDatabases } from "./db";
import ordersRouter from "./routes/orders";
import adminRouter from "./routes/admin";
import credentialsRouter from "./routes/credentials";

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "✓ Server is running", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/credentials", credentialsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// Initialize databases and start server
(async () => {
  try {
    console.log("🚀 Starting UPI Payment System Server...");

    // Initialize databases
    await initializeDatabases();

    // Start listening
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ Orders API:   http://localhost:${PORT}/api/orders`);
      console.log(`✓ Admin API:    http://localhost:${PORT}/api/admin`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

export default app;

