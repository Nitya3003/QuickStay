import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'; // Keeping as-is
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import User from "./models/User.js";

// Initialize Express app
const app = express();

// Connect to database (with error handling)
connectDB().catch(err => {
  console.error("Database connection error:", err);
  process.exit(1);
});

// Middleware - Keeping your original setup
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // Unchanged as requested

// Webhook endpoint
app.post("/api/clerk", 
  express.raw({ type: 'application/json' }), // Required for webhook verification
  clerkWebhooks
);

// Health check
app.get('/', (req, res) => res.send("API is working"));

// Error handling middleware (recommended addition)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Export for Vercel compatibility (without changing existing behavior)
const vercelHandler = app;
export default vercelHandler;

// Local server (runs only when not in Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}