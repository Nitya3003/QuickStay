import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import User from "./models/User.js";

// Initialize Express app
const app = express();

// Connect to DB
connectDB().catch(err => {
  console.error("Database connection error:", err);
  process.exit(1);
});

// Use CORS and Clerk middleware before routes
app.use(cors());
app.use(clerkMiddleware());

// ✅ Handle Clerk webhook BEFORE express.json
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }), // Important: raw body needed for verification
  clerkWebhooks
);

// ✅ All other routes can use JSON parsing
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("API is working");
});

// Optional: Add any other routes here

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).send("Server Error");
});

// ✅ Export the handler for Vercel
export default app;

// ✅ Only run the server locally (i.e., not on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
